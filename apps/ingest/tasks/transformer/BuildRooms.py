import luigi
import luigi.contrib.postgres
import json
import typing
import sqlmodel

from common.file_system.FileSystem import FileSystem
from common.env.env import DATABASE_HOST, DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD
from common.db import engine

from model.UnitFeatureCollection import UnitFeature
from model.db.RenderingEntity import RenderingEntity
from model.db.Room import Room
from model.db.Floor import Floor

from tasks.transformer.BuildIDMap import BuildIDMap
from tasks.transformer.BuildRenderingEntities import BuildRenderingEntities
from tasks.util.json import load_as_json

from tasks.transformer.BuildFloors import BuildFloors
from constants import ROOM_DATA_PATH


class BuildRooms(luigi.Task):
    """
    Takes in a map of ID -> Features for a room/building/floor
    and builds rendering entity models out of it
    """
    file_path = ROOM_DATA_PATH
    file_system = FileSystem()

    TABLE_NAME = ROOM_DATA_PATH

    def requires(self):
        return [
            BuildIDMap(self.file_path, entity_type=self.TABLE_NAME),
            BuildRenderingEntities(self.file_path, entity_type=self.TABLE_NAME),
            BuildFloors()
        ]

    def _build_room(self, feature_id: int, feature: UnitFeature, rendering_entity: RenderingEntity, floors_by_name: dict[str, int]) -> Room:
        name = feature.properties['RM_NM']
        fl_nm = feature.properties["FL_NM"]
        floor_id = floors_by_name.get(fl_nm)

        return Room(
            name=name,
            rendering_entity_id=rendering_entity.id,
            floor_id=floor_id,
        )


    def run(self):
        inputs = self.input()
        json_targets = [t for t in inputs if isinstance(t, luigi.LocalTarget)]
        feature_str_by_id, rendering_entities_str_by_id = [
            load_as_json(t) for t in json_targets
        ]

        # feature_str_by_id, rendering_entities_str_by_id = [load_as_json(input) for input in self.input()]
        features_by_id: typing.Dict[int, UnitFeature] = {id: UnitFeature.parse_obj(json.loads(feature)) for id, feature in feature_str_by_id.items()}
        rendering_entities_by_id: typing.Dict[int, RenderingEntity] = {id: RenderingEntity.parse_obj(json.loads(rendering_entity)) for id, rendering_entity in rendering_entities_str_by_id.items()}

        # room_by_id: typing.Dict[int, Room] = {id: self._build_room(id, feature, rendering_entities_by_id[id]) for id, feature in features_by_id.items()}

        session = sqlmodel.Session(engine)
        with session:
            floors_by_name = {
                f.name: f.id for f in session.query(Floor).all()
            }

            for feature_id, feature in features_by_id.items():
                rendering_entity = rendering_entities_by_id[feature_id]
                room = self._build_room(
                    feature_id,
                    feature,
                    rendering_entity,
                    floors_by_name,
                )
                session.add(room)

            session.commit()

        with self.output().connect() as conn:
            self.output().touch(conn)

    def output(self):
        return luigi.contrib.postgres.PostgresTarget(
            host=DATABASE_HOST,
            database=DATABASE_NAME,
            user=DATABASE_USER,
            password=DATABASE_PASSWORD,
            table=self.TABLE_NAME,
            update_id=self.task_id
        )

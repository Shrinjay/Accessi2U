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

from tasks.transformer.BuildIDMap import BuildIDMap
from tasks.transformer.BuildRenderingEntities import BuildRenderingEntities
from tasks.util.json import load_as_json


class BuildRooms(luigi.Task):
    """
    Takes in a map of ID -> Features for a room/building/floor
    and builds rendering entity models out of it

    TODO: Have this save these entities to database
    """
    file_path = luigi.PathParameter()
    file_system = FileSystem()

    TABLE_NAME = 'room'

    def requires(self):
        return [BuildIDMap(self.file_path), BuildRenderingEntities(self.file_path)]

    def _build_room(self, feature_id: int, feature: UnitFeature, rendering_entity: RenderingEntity) -> Room:
        name = feature.properties['RM_NM']

        return Room(
            name=name,
            rendering_entity_id=rendering_entity.id,
        )

    def run(self):
        feature_str_by_id, rendering_entities_str_by_id = [load_as_json(input) for input in self.input()]
        features_by_id: typing.Dict[int, UnitFeature] = {id: UnitFeature.parse_obj(json.loads(feature)) for id, feature in feature_str_by_id.items()}
        rendering_entities_by_id: typing.Dict[int, RenderingEntity] = {id: RenderingEntity.parse_obj(json.loads(rendering_entity)) for id, rendering_entity in rendering_entities_str_by_id.items()}

        room_by_id: typing.Dict[int, Room] = {id: self._build_room(id, feature, rendering_entities_by_id[id]) for id, feature in features_by_id.items()}

        session = sqlmodel.Session(engine)

        with session.begin():
            for room in room_by_id.values():
                session.add(room)

        session.commit()

    def output(self):
        return luigi.contrib.postgres.PostgresTarget(
            host=DATABASE_HOST,
            database=DATABASE_NAME,
            user=DATABASE_USER,
            password=DATABASE_PASSWORD,
            table=self.TABLE_NAME,
            update_id=self.task_id
        )

import luigi
import shapely
import luigi.contrib.postgres
import json
import typing
import sqlmodel

from common.file_system.FileSystem import FileSystem
from common.env.env import DATABASE_HOST, DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, DATABASE_PORT
from common.db import engine

from model.UnitFeatureCollection import UnitFeature
from model.db.RenderingEntity import RenderingEntity
from model.db.Floor import Floor
from model.db.Building import Building

from tasks.transformer.BuildIDMap import BuildIDMap
from tasks.transformer.BuildRenderingEntities import BuildRenderingEntities
from tasks.util.json import load_as_json

from tasks.transformer.BuildBuildings import BuildBuildings
from constants import FLOOR_DATA_PATH

class BuildFloors(luigi.Task):
    """
    Takes in a map of ID -> Features for a floors
    and builds rendering entity models out of it
    """
    file_path = FLOOR_DATA_PATH
    file_system = FileSystem()

    TABLE_NAME = 'build_floors_complete'

    def requires(self):
        return [
            BuildIDMap(self.file_path, entity_type=self.TABLE_NAME),
            BuildRenderingEntities(self.file_path, entity_type=self.TABLE_NAME),
            BuildBuildings()
        ]
    
    def _build_floor(self, feature_id: int, feature: UnitFeature, rendering_entity: RenderingEntity, buildings_by_name: dict[str, int]) -> Floor:
        name = feature.properties['FL_NM']
        bl_abbr = feature.properties['BL_ABBR']
        building_id = buildings_by_name.get(bl_abbr)
        
        level = int(feature.properties['FL_ID'][:2])

        shapely_building = shapely.geometry.shape(feature.geometry)
        area = shapely.area(shapely_building)

        return Floor(
            name=name,
            level=level,
            rendering_entity_id=rendering_entity.id,
            building_id=building_id,
            area=area
        )

    def run(self):
        inputs = self.input()
        json_targets = [t for t in inputs if isinstance(t, luigi.LocalTarget)]
        feature_str_by_id, rendering_entities_str_by_id = [
            load_as_json(t) for t in json_targets
        ]

        features_by_id: typing.Dict[int, UnitFeature] = {id: UnitFeature.parse_obj(json.loads(feature)) for id, feature in feature_str_by_id.items()}
        rendering_entities_by_id: typing.Dict[int, RenderingEntity] = {id: RenderingEntity.parse_obj(json.loads(rendering_entity)) for id, rendering_entity in rendering_entities_str_by_id.items()}

        session = sqlmodel.Session(engine)
        with session:
            buildings_by_name = {
                b.name: b.id
                for b in session.query(Building).all()
            }

            for id_, feature in features_by_id.items():
                rendering_entity = rendering_entities_by_id[id_]
                floor_obj = self._build_floor(
                    id_,
                    feature,
                    rendering_entity,
                    buildings_by_name
                )
                session.add(floor_obj)
            session.commit()

        with self.output().connect() as conn:
            self.output().touch(conn)

    def output(self):
        return luigi.contrib.postgres.PostgresTarget(
            host=DATABASE_HOST,
            database=DATABASE_NAME,
            port=DATABASE_PORT,
            user=DATABASE_USER,
            password=DATABASE_PASSWORD,
            table=self.TABLE_NAME,
            update_id=self.task_id
        )

import json

import luigi
import luigi.contrib.postgres
import typing
import uuid
import sqlmodel

from common.env.env import DATABASE_URL, DATABASE_HOST, DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD
from common.file_system.FileSystem import FileSystem
from common.file_system import FileSystemEnum
from common.db import engine

from model.UnitFeatureCollection import UnitFeature
from model.db.RenderingEntity import RenderingEntity

from tasks.transformer.BuildIDMap import BuildIDMap
from tasks.util.json import load_as_json


class BuildRenderingEntities(luigi.Task):
    """
    Takes in a map of ID -> Features for a room/building/floor
    and builds rendering entity models out of it

    TODO: Have this save these entities to database
    """
    file_path = luigi.PathParameter()
    entity_type = luigi.Parameter()
    file_system = FileSystem()

    TABLE_NAME = 'renderingentity'

    def requires(self):
        return BuildIDMap(self.file_path, entity_type=self.entity_type)

    def _build_rendering_entity(self, feature: UnitFeature):
        geometry = feature.json()
        geometry_file = self.file_system.write(FileSystemEnum.LOCAL, f'./out/tmp/{uuid.uuid4()}.json', geometry)

        rendering_entity = RenderingEntity(file_id=geometry_file.id)
        return rendering_entity

    def run(self):
        feature_dict_by_id: typing.Dict[int, str] = load_as_json(self.input())
        features_by_id: typing.Dict[int, UnitFeature] = {id: UnitFeature.parse_obj(json.loads(feature)) for id, feature in feature_dict_by_id.items()}
        rendering_entities_by_id = {id: self._build_rendering_entity(feature) for id, feature in features_by_id.items()}

        session = sqlmodel.Session(engine)

        with session:
            for id, rendering_entity in rendering_entities_by_id.items():
                session.add(rendering_entity)
            session.commit()

            for id, rendering_entity in rendering_entities_by_id.items():
                session.refresh(rendering_entity)

        local_output = self.output()
        with local_output.open('w') as f:
            f.write(json.dumps({k: v.json() for k, v in rendering_entities_by_id.items()}))


    def output(self):
        return luigi.LocalTarget(f'out/rendering_entities_{self.entity_type}.json')

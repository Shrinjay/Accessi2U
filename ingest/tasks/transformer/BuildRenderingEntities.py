import json

import luigi
import typing
import uuid

from common.file_system.FileSystem import FileSystem
from common.file_system import FileSystemEnum

from model.UnitFeatureCollection import UnitFeatureCollectionFeature
from model.db.RenderingEntity import RenderingEntity

from tasks.transformer.BuildIDMap import BuildIDMap
from tasks.util.json import load_as_json


class BuildRenderingEntities(luigi.Task):
    file_path = luigi.PathParameter()
    file_system = FileSystem()

    def requires(self):
        return BuildIDMap(self.file_path)

    def _build_rendering_entity(self, feature: UnitFeatureCollectionFeature):
        geometry = feature.geometry
        geometry_json = json.dumps(geometry)
        geometry_file = self.file_system.write(FileSystemEnum.LOCAL, f'./out/tmp/{uuid.uuid4()}.json', geometry_json)

        rendering_entity = RenderingEntity(file_id=geometry_file.id)
        return rendering_entity

    def run(self):
        feature_dict_by_id: typing.Dict[int, str] = load_as_json(self.input())
        features_by_id: typing.Dict[int, UnitFeatureCollectionFeature] = {id: UnitFeatureCollectionFeature.parse_obj(json.loads(feature)) for id, feature in feature_dict_by_id.items()}
        rendering_entities_by_id = {id: self._build_rendering_entity(feature) for id, feature in features_by_id.items()}
        print(rendering_entities_by_id)
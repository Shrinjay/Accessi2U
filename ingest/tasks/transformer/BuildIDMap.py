import luigi
import json
import typing

from tasks.loader.LoadJSON import LoadJson
from tasks.util.json import load_as_json
from model.UnitFeatureCollection import UnitFeatureCollection, UnitFeatureCollectionFeature


class BuildIDMap(luigi.Task):
    file_path = luigi.PathParameter(exists=True)

    def requires(self):
        return LoadJson(self.file_path)

    def run(self):
        unit_data = load_as_json(self.input())
        unit_feature_collection = UnitFeatureCollection.parse_obj(unit_data)
        unit_features = unit_feature_collection.features

        id_map: typing.Dict[int, UnitFeatureCollectionFeature] = {x.id:x for x in unit_features}

        with self.output().open('w') as f:
            f.write(json.dumps({x.id: x.json() for x in unit_features}))

    def output(self):
        return luigi.LocalTarget('out/id_map.json')


        
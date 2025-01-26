import luigi
import json
import typing

from tasks.extractor.ExtractJson import ExtractJson
from tasks.util.json import load_as_json
from model.UnitFeatureCollection import UnitFeatureCollection, UnitFeature


class BuildIDMap(luigi.Task):
    """
    Takes in the raw room/floor/building data and turns it into a map of ID -> Feature
    This lets us uniquely reference a feature by its ID down the line
    """
    file_path = luigi.PathParameter(exists=True)

    def requires(self):
        return ExtractJson(self.file_path)

    def run(self):
        unit_data = load_as_json(self.input())
        unit_feature_collection = UnitFeatureCollection.parse_obj(unit_data)
        unit_features = unit_feature_collection.features

        id_map: typing.Dict[int, UnitFeature] = {x.id:x for x in unit_features}

        with self.output().open('w') as f:
            f.write(json.dumps({x.id: x.json() for x in unit_features}))

    def output(self):
        return luigi.LocalTarget('out/id_map.json')

import luigi
import json


def load_as_json(file_target: luigi.Target):
    with file_target.open('r') as f:
        return json.load(f)

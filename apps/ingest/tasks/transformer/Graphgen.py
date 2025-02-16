import luigi
import geo_adjacency.adjacency as adj
import typing
import json
import shapely

from tasks.util.json import load_as_json
from tasks.util.properties import PropertyType, RmStandard
from tasks.transformer.BuildIDMap import BuildIDMap

from common.file_system.FileSystem import FileSystem

from model.UnitFeatureCollection import UnitFeature


def is_corridor(feature: UnitFeature) -> bool:
    return feature.properties[PropertyType.RM_STANDARD.value] == RmStandard.CORRIDOR.value

"""
How graph
We need to be able to determine paths between any two rooms in a building (initially)
Let's assume we have a graph stored as nodes and edges, for each node we have a list of edges that they connect into
For adjacent edges, do we want to treat those as one contiguous edge? Right no we call those connection points, so those are nodes

So we can build the initial graph with just edges and connection point nodes for all the edges
For each room, we can find the adjacent edges in the same building and floor, and associate the node with those edges

Ok, so a rough algorithm for generation
- Find all adjacent edges in a building
- For each adjacent edge, we create a node called a connection point
- Store the two edges in the db, store the connection point node in the db

For each room in a building
- Find all the adjacent edges in the same building and floor by basically flipping the adjacency logic here
- For each adjacent edge, we create the node for the room and we associate it with that edge

For search:
- Given a room
- Find all possible edges that are connected to that node
- If the target is within the set of nodes connected to that edge, we can just return that edge as the path
- If the target is not within the set of nodes connected to that edge, find all connection points that are connected to that edge and start from step 2

Data model
Node:
    - ID
    - Type (Room, Connection Point)
    - Building ID
    - Floor ID 

"""

class Graphgen(luigi.Task):
    """
    Takes in a map of ID -> Features for a room/building/floor
    and builds rendering entity models out of it
    """
    file_path = luigi.PathParameter()
    file_system = FileSystem()

    TABLE_NAME = 'room'

    def requires(self):
        return BuildIDMap(self.file_path)

    def run(self):
        """
        notes
        1. We don't have obstacles in between buildings, so we need to determine adjacency within a building
        e.g we only consider source-source adjacency by filtering for corridors within a building

        ROUGH WORK
        687 is a corridor, 684 is an adjacent corridor, so is 718
        695 is adjacent to 718 but not 684 and 687
        an obstacle is 637 - a room

        pump these into our dataset and see wtf happens lmao
        expect:
        0 is adjacent to 1, 2, but not 3
        """
        # object_ids = [687, 684, 718, 637, 695, 468, 682, 467, 678]
        feature_str_by_id = load_as_json(self.input())
        features_by_id: typing.Dict[int, UnitFeature] = {id: UnitFeature.parse_obj(json.loads(feature)) for id, feature in feature_str_by_id.items()}

        features_by_id_by_floor_by_building = {}
        for feature_id, feature in features_by_id.items():
            building_id = feature.properties[PropertyType.BUILDING_ID.value]
            floor_id = feature.properties[PropertyType.FLOOR_ID.value]

            if building_id not in features_by_id_by_floor_by_building:
                features_by_id_by_floor_by_building[building_id] = {}

            if floor_id not in features_by_id_by_floor_by_building[building_id]:
                features_by_id_by_floor_by_building[building_id][floor_id] = {}

            features_by_id_by_floor_by_building[building_id][floor_id][feature_id] = feature

        for building_id, features_by_id_by_floor in features_by_id_by_floor_by_building.items():
            for floor_id, features_by_id in features_by_id_by_floor.items():
                corridors = [feature for feature in features_by_id.values() if is_corridor(feature)]
                non_corridors = [feature for feature in features_by_id.values() if not is_corridor(feature)]

                shapely_corridors = [shapely.geometry.shape(corridor.geometry) for corridor in corridors]
                shapely_non_corridors = [shapely.geometry.shape(non_corridor.geometry) for non_corridor in non_corridors]

                engine = adj.AdjacencyEngine(shapely_corridors, shapely_corridors, shapely_non_corridors, densify_features=True)
                engine.plot_adjacency_dict()

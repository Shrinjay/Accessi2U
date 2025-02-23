import luigi
import geo_adjacency.adjacency as adj
import typing
import json
import shapely
import collections

from tasks.util.json import load_as_json
from tasks.util.list import flatten_list
from tasks.util.properties import PropertyType, RmStandard
from tasks.transformer.EdgeGen import EdgeGen
from tasks.transformer.BuildIDMap import BuildIDMap

from common.file_system.FileSystem import FileSystem

from model.UnitFeatureCollection import UnitFeature
from model.db.Edge import Edge
from model.db.Node import Node, NodeTypeEnum
from model.db.Room import Room

from services.FloorService import FloorService
from services.BuildingService import BuildingService
from services.RoomService import RoomService
from services.EdgeService import EdgeService
from services.NodeService import NodeService


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
    - External ID -> Room ID for rooms
    - Building ID
    - Floor ID 
Edge:
    - ID
    - Building ID
    - Floor ID

Adjacency
    - ID
    - Node ID
    - Edge ID

TODO
- Create Node, Edge, Adjacency models
- Creat edge generator
- Create node generator for rooms - using data from the outputs rather than the database - db becomes push only

Later?
- Add room -> floor and floor -> building association
- Refactor room, floor builders to add the room-floor, floor-building associations
"""

class NodeGen(luigi.Task):
    file_path = luigi.PathParameter()
    file_system = FileSystem()
    entity_type = luigi.Parameter()

    floor_service = FloorService()
    building_service = BuildingService()
    room_service = RoomService()
    edge_service = EdgeService()
    node_service = NodeService()

    TABLE_NAME = 'room'

    def requires(self):
        return [EdgeGen(self.file_path, self.entity_type), BuildIDMap(self.file_path, self.entity_type)]

    def _create_room_node(self, building_id: str, floor_id: str, room: Room, corridors: typing.List[Room]):
        building = self.building_service.get_building_by_name(building_id)
        floor = self.floor_service.get_floor_by_name(f"{building_id}_{floor_id}")

        node = Node(
            node_type=NodeTypeEnum.ROOM,
            building_id=building.id,
            floor_id=floor.id,
            room_id=room.id
        )

        node = self.node_service.create(node)
        for corridor in corridors:
            edge = self.edge_service.get_by_room(corridor)
            self.node_service.add_edge(node, edge)


    def run(self):
        feature_str_by_id = load_as_json(self.input()[1])
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
                corridors_by_feature_id = collections.OrderedDict(
                    [(feature_id, feature) for (feature_id, feature) in features_by_id.items() if is_corridor(feature)]
                )
                rooms_by_feature_id = collections.OrderedDict(
                    [(feature_id, feature) for (feature_id, feature) in features_by_id.items() if not is_corridor(feature)]
                )

                shapely_corridors = [shapely.geometry.shape(corridor.geometry) for corridor in corridors_by_feature_id.values()]

                shapely_rooms = [shapely.geometry.shape(non_corridor.geometry) for non_corridor in rooms_by_feature_id.values()]
                # use this to retrieve the feature ids from the indexes that geo_adjacency gives to us
                room_feature_id_by_idx = dict(
                    (idx, feature_id) for idx, feature_id in enumerate(rooms_by_feature_id.keys())
                )
                corridor_feature_id_by_idx = dict(
                    (idx, feature_id) for idx, feature_id in enumerate(corridors_by_feature_id.keys())
                )

                engine = adj.AdjacencyEngine(shapely_rooms, shapely_corridors, shapely_rooms, densify_features=True, max_distance=0.000001)
                adjacency_by_idx = engine.get_adjacency_dict()
                adjacency_tuples = [
                            (
                                room_feature_id_by_idx[from_idx],
                                [corridor_feature_id_by_idx[to_idx] for to_idx in to_idxs]
                            ) for from_idx, to_idxs in adjacency_by_idx.items()
                ]
                adjacency = dict(adjacency_tuples)
                print(adjacency)

                for room_feature_id, corridor_feature_ids in adjacency.items():
                    room = rooms_by_feature_id[room_feature_id]
                    adjacent_corridors = [corridors_by_feature_id[corridor_feature_id] for corridor_feature_id in corridor_feature_ids]

                    room_name = room.properties[PropertyType.RM_NAME.value]
                    room = self.room_service.get_room_by_name(room_name)

                    corridor_names = [corridor.properties[PropertyType.RM_NAME.value] for corridor in adjacent_corridors]
                    corridors = [self.room_service.get_room_by_name(corridor_name) for corridor_name in corridor_names]

                    self._create_room_node(building_id, floor_id, room, corridors)


from collections import defaultdict

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
from model.db.Edge import Edge, EdgeTypeEnum
from model.db.Node import Node, NodeTypeEnum
from model.db.Room import Room

from services.FloorService import FloorService
from services.BuildingService import BuildingService
from services.RoomService import RoomService
from services.EdgeService import EdgeService
from services.NodeService import NodeService


def is_corridor(feature: UnitFeature) -> bool:
    return feature.properties[PropertyType.RM_STANDARD.value] == RmStandard.CORRIDOR.value

def is_elevator(feature: UnitFeature) -> bool:
    return feature.properties[PropertyType.RM_STANDARD.value] == RmStandard.ELEVATOR.value

def is_stair(feature: UnitFeature) -> bool:
    return feature.properties[PropertyType.RM_STANDARD.value] == RmStandard.STAIR.value

def is_regular_room(feature: UnitFeature) -> bool:
    return not is_corridor(feature) and not is_elevator(feature) and not is_stair(feature)

def get_node_type(feature: UnitFeature) -> NodeTypeEnum:
    if is_stair(feature):
        return NodeTypeEnum.STAIR
    elif is_elevator(feature):
        return NodeTypeEnum.ELEVATOR
    elif is_regular_room(feature):
        return NodeTypeEnum.ROOM

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

OK inter-floor time
For elevators we need to
Find all the elevators in the same building
Group all the elevators that are close (within 0.00001) of each other in long and lat and in diff floors 

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

    def _create_room_node(self, building_id: str, floor_id: str, room: Room, corridors: typing.List[Room], node_type: NodeTypeEnum):
        building = self.building_service.get_building_by_name(building_id)
        floor = self.floor_service.get_floor_by_name(f"{building_id}_{floor_id}")

        node = Node(
            node_type=node_type,
            building_id=building.id,
            floor_id=floor.id,
            room_id=room.id
        )

        node = self.node_service.create(node)
        for corridor in corridors:
            edge = self.edge_service.get_by_room(corridor)
            self.node_service.add_edge(node, edge)

        return node

    def _build_adjacent_elevator_map(self, features_by_id_by_floor: typing.Dict[int, typing.Dict[int, UnitFeature]]) -> typing.Dict[int, typing.List[int]]:
        features_by_id = {}
        for features in features_by_id_by_floor.values():
            features_by_id.update(features)

        elevators_by_id = {id: feature for id, feature in features_by_id.items() if is_elevator(feature)}
        adjacent_elevators_by_id = defaultdict(list)

        for elevator_feature_id, elevator_feature in elevators_by_id.items():
            # get all other elevators in the same building on a different floor
            adjacent_elevators = []
            curr_elevator_floor = elevator_feature.properties[PropertyType.FLOOR_ID.value]
            curr_elevator_lat = float(elevator_feature.properties[PropertyType.LAT.value])
            curr_elevator_lon = float(elevator_feature.properties[PropertyType.LON.value])

            for other_elevator_id, other_elevator in elevators_by_id.items():
                if other_elevator_id == elevator_feature_id:
                    continue

                other_elevator_floor = other_elevator.properties[PropertyType.FLOOR_ID.value]
                if curr_elevator_floor == other_elevator_floor:
                    continue

                other_elevator_lat = float(other_elevator.properties[PropertyType.LAT.value])
                other_elevator_lon = float(other_elevator.properties[PropertyType.LON.value])

                lat_diff = abs(curr_elevator_lat - other_elevator_lat)
                lon_diff = abs(curr_elevator_lon - other_elevator_lon)

                if lat_diff < 0.0001 and lon_diff < 0.0001:
                    adjacent_elevators.append(other_elevator_id)

            adjacent_elevators_by_id[elevator_feature_id] = adjacent_elevators

        return adjacent_elevators_by_id

    def _build_adjacent_stair_map(self, features_by_id_by_floor: typing.Dict[int, typing.Dict[int, UnitFeature]]) -> typing.Dict[int, typing.List[int]]:
        features_by_id = {}
        for features in features_by_id_by_floor.values():
            features_by_id.update(features)

        stairs_by_id = {id: feature for id, feature in features_by_id.items() if is_stair(feature)}
        adjacent_stairs_by_id = defaultdict(list)

        for stair_feature_id, stair_feature in stairs_by_id.items():
            # get all other stairs in the same building on a different floor
            adjacent_stairs = []
            curr_stair_floor = int(stair_feature.properties[PropertyType.FLOOR_ID.value])
            curr_stair_lat = float(stair_feature.properties[PropertyType.LAT.value])
            curr_stair_lon = float(stair_feature.properties[PropertyType.LON.value])

            for other_stair_id, other_stair in stairs_by_id.items():
                if other_stair_id == stair_feature_id:
                    continue

                other_stair_floor = int(other_stair.properties[PropertyType.FLOOR_ID.value])
                if abs(curr_stair_floor - other_stair_floor) != 1:
                    continue

                other_stair_lat = float(other_stair.properties[PropertyType.LAT.value])
                other_stair_lon = float(other_stair.properties[PropertyType.LON.value])

                lat_diff = abs(curr_stair_lat - other_stair_lat)
                lon_diff = abs(curr_stair_lon - other_stair_lon)

                if lat_diff < 0.0001 and lon_diff < 0.0001:
                    adjacent_stairs.append(other_stair_id)

            adjacent_stairs_by_id[stair_feature_id] = adjacent_stairs

        return adjacent_stairs_by_id

    # takes in map featureID -> featureID[]
    # returns map featureID -> node[]
    def to_nodes_map(self, feature_id_map: dict[int, list[int]], node_by_id: dict[int, Node]) -> dict[int, list[Node]]:
        return {feature_id: [node_by_id[adjacent_feature_id] for adjacent_feature_id in adjacent_feature_ids if adjacent_feature_id in node_by_id] for feature_id, adjacent_feature_ids in feature_id_map.items()}

    def _create_inter_floor_edge(self, from_node: Node, to_node: Node):
        edge = Edge(
            building_id=from_node.building_id,
            floor_id=from_node.floor_id,
            edge_type=EdgeTypeEnum.INTER_FLOOR,
            to_floor_id=to_node.floor_id
        )

        edge = self.edge_service.create(edge)
        self.node_service.add_edge(from_node, edge)
        self.node_service.add_edge(to_node, edge)

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

        node_by_feature_id = {}
        for building_id, features_by_id_by_floor in features_by_id_by_floor_by_building.items():
            for floor_id, features_by_id in features_by_id_by_floor.items():
                corridors_by_feature_id = collections.OrderedDict(
                    [(feature_id, feature) for (feature_id, feature) in features_by_id.items() if is_corridor(feature)]
                )
                rooms_by_feature_id = collections.OrderedDict(
                    [(feature_id, feature) for (feature_id, feature) in features_by_id.items() if is_regular_room(feature) or is_elevator(feature) or is_stair(feature)]
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

                engine = adj.AdjacencyEngine(shapely_rooms, shapely_corridors, shapely_rooms, densify_features=True, max_distance=0.0000015)
                adjacency_by_idx = engine.get_adjacency_dict()
                adjacency_tuples = [
                            (
                                room_feature_id_by_idx[from_idx],
                                [corridor_feature_id_by_idx[to_idx] for to_idx in to_idxs]
                            ) for from_idx, to_idxs in adjacency_by_idx.items()
                ]
                adjacency = dict(adjacency_tuples)

                for room_feature_id, corridor_feature_ids in adjacency.items():
                    room = rooms_by_feature_id[room_feature_id]
                    adjacent_corridors = [corridors_by_feature_id[corridor_feature_id] for corridor_feature_id in corridor_feature_ids]

                    room_name = room.properties[PropertyType.RM_NAME.value]
                    room = self.room_service.get_room_by_name(room_name)

                    corridor_names = [corridor.properties[PropertyType.RM_NAME.value] for corridor in adjacent_corridors]
                    corridors = [self.room_service.get_room_by_name(corridor_name) for corridor_name in corridor_names]

                    node = self._create_room_node(building_id, floor_id, room, corridors, get_node_type(features_by_id[room_feature_id]))
                    node_by_feature_id[room_feature_id] = node

                for room_feature_id, room_id in node_by_feature_id.items():
                    if room_feature_id in node_by_feature_id:
                        continue

                    room = rooms_by_feature_id[room_feature_id]
                    room_name = room.properties[PropertyType.RM_NAME.value]
                    room = self.room_service.get_room_by_name(room_name)

                    node = self._create_room_node(building_id, floor_id, room, [], get_node_type(features_by_id[room_feature_id]))
                    node_by_feature_id[room_feature_id] = node

        # map of elevator feature ids to elevator feature ids
        for building_id, features_by_id_by_floor in features_by_id_by_floor_by_building.items():
            adjacent_elevators = self._build_adjacent_elevator_map(features_by_id_by_floor)
            adjacent_elevator_node_map = self.to_nodes_map(adjacent_elevators, node_by_feature_id)

            adjacent_stairs = self._build_adjacent_stair_map(features_by_id_by_floor)
            adjacent_stair_node_map = self.to_nodes_map(adjacent_stairs, node_by_feature_id)

            for feature_id, adjacent_elevator_nodes in adjacent_elevator_node_map.items():
                # TODO: Why are we not finding some nodes??
                if feature_id not in node_by_feature_id:
                    continue

                for adjacent_elevator_node in adjacent_elevator_nodes:
                    self._create_inter_floor_edge(node_by_feature_id[feature_id], adjacent_elevator_node)

            for feature_id, adjacent_stair_nodes in adjacent_stair_node_map.items():
                # TODO: Why are we not finding some nodes??
                if feature_id not in node_by_feature_id:
                    continue

                for adjacent_stair_node in adjacent_stair_nodes:
                    self._create_inter_floor_edge(node_by_feature_id[feature_id], adjacent_stair_node)

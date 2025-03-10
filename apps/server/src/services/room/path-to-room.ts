import { Edge, Room, Node, NodeTypeEnum, EdgeTypeEnum } from 'database';
import { _room } from './index.js';
import { _node } from '../node/index.js';
import { _edge } from '../edge/index.js';

export const pathToRoom = async (room: Room, toRoom: Room) => {
  const node = await _room.node(room);
  const toNode = await _room.node(toRoom);

  const initialEdges = await _node.edges(node);
  const paths = await Promise.all(initialEdges.map((edge) => dfsPathInHypergraph(edge, toNode)));

  const path = paths.filter(Boolean).sort((a, b) => a.length - b.length)?.[0];
  return path;
};

const dfsPathInHypergraph = async (
  edge: Edge,
  toNode: Node,
  path: Edge[] = [],
  visitedEdgeIds: Set<number> = new Set(),
  visitedNodeIds: Set<number> = new Set(),
): Promise<Edge[]> => {
  // add edge to visited edge ids
  // check if node is at a different floor than current node

  // if it is, we need to find the next elevator or stair
  // first look for all elevators and stairs in the set of adjacent nodes
  // for each one we find, get the outgoing edges that are an inter_floor edge and search through those
  // if we find none, then continue before

  // for this edge, get all adjacent nodes
  // check if any of the adjacent nodes are toNode
  // if yes, this edge is it, add to path and return
  // otherwise get all connection nodes for this edge
  // get all of their edges that are not in visited edge ids
  // dfs those edges

  const nextVisitedNodeIds = new Set(visitedNodeIds);
  const nextVisitedEdgeIds = visitedEdgeIds.add(edge.id);
  const nextPath = [...path, edge];

  const nodes = await _edge.nodes(edge);

  const isFinalEdge = nodes.some((node) => node.id === toNode.id);
  if (isFinalEdge) {
    return nextPath;
  }

  const elevatorOrStairNodes = nodes.filter(
    (node) => node.node_type === NodeTypeEnum.ELEVATOR || node.node_type === NodeTypeEnum.STAIR,
  );
  const isDifferentFloor = edge.floor_id !== toNode.floor_id;
  if (isDifferentFloor && elevatorOrStairNodes.length > 0) {
    const outgoingInterfloorEdgesNested = [];

    for (const node of elevatorOrStairNodes) {
      if (visitedNodeIds.has(node.id)) {
        continue;
      }
      nextVisitedNodeIds.add(node.id);
      const outgoingInterfloorEdges = await _node.edges(node);
      outgoingInterfloorEdgesNested.push(outgoingInterfloorEdges);
    }

    const outgoingInterfloorEdges = outgoingInterfloorEdgesNested.flat().filter((edge) => !visitedEdgeIds.has(edge.id));

    return await Promise.any(
      outgoingInterfloorEdges.map((edge) =>
        dfsPathInHypergraph(edge, toNode, nextPath, nextVisitedEdgeIds, nextVisitedNodeIds),
      ),
    );
  }

  const connectionNodes = nodes
    .filter((node) => {
      if (visitedNodeIds.has(node.id)) {
        return false;
      }
      nextVisitedNodeIds.add(node.id);
      return true;
    })
    .filter((node) => node.node_type === NodeTypeEnum.CONNECTION_POINT);

  const outgoingEdgesNested = [];

  for (const node of connectionNodes) {
    const outgoingEdges = await _node.edges(node);
    outgoingEdgesNested.push(outgoingEdges);
  }

  const outgoingEdges = outgoingEdgesNested
    .flat()
    .filter((edge) => edge.edge_type === EdgeTypeEnum.REGULAR)
    .filter((edge) => !visitedEdgeIds.has(edge.id));

  if (outgoingEdges.length === 0) {
    throw new Error('No path found');
  }

  const foundPath = await Promise.any(
    outgoingEdges.map((edge) => dfsPathInHypergraph(edge, toNode, nextPath, nextVisitedEdgeIds, nextVisitedNodeIds)),
  );

  return foundPath;
};

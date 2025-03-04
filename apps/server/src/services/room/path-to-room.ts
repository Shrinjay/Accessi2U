import { Edge, Room, Node, NodeTypeEnum, Prisma } from 'database';
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
    const outgoingInterfloorEdges = await Promise.all(elevatorOrStairNodes.map((node) => _node.edges(node)))
      .then((edges) => edges.flat())
      .then((edges) => edges.filter((edge) => !visitedEdgeIds.has(edge.id)));

    const nextPaths = await Promise.all(
      outgoingInterfloorEdges.map((edge) => dfsPathInHypergraph(edge, toNode, nextPath, nextVisitedEdgeIds)),
    );

    return nextPaths.find(Boolean) || null;
  }

  const connectionNodes = nodes.filter((node) => node.node_type === NodeTypeEnum.CONNECTION_POINT);
  const outgoingEdges = await Promise.all(connectionNodes.map((connNode) => _node.edges(connNode)))
    .then((edges) => edges.flat())
    .then((edges) => edges.filter((edge) => !visitedEdgeIds.has(edge.id)));

  if (outgoingEdges.length === 0) {
    return null;
  }

  const nextPaths = await Promise.all(
    outgoingEdges.map((edge) => dfsPathInHypergraph(edge, toNode, nextPath, nextVisitedEdgeIds)),
  );

  return nextPaths.find(Boolean) || null;
};

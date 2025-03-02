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

import { Edge, Node } from 'database';
import { prisma } from '../../config/prisma.js';

export const edges = async (node: Node): Promise<Edge[]> => {
  const adjs = await prisma.adjacency.findMany({
    where: {
      node_id: node.id,
    },
    include: {
      edge: true,
    },
  });

  return adjs.map((adj) => adj.edge);
};

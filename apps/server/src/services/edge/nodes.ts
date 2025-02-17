import { Edge, Node } from 'database';
import { prisma } from '../../config/prisma.js';

export const nodes = async (edge: Edge): Promise<Node[]> => {
  const adjs = await prisma.adjacency.findMany({
    where: {
      edge_id: edge.id,
    },
    include: {
      node: true,
    },
  });

  return adjs.map((adj) => adj.node);
};

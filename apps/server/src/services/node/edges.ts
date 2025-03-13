import { Building, Edge, Floor, Node, Prisma, Room } from 'database';
import { prisma } from '../../config/prisma.js';

export type EdgeWithRoom = Edge & { building: Building; floor: Floor; room: Room; to_floor: Floor };

export const edges = async (node: Node): Promise<EdgeWithRoom[]> => {
  const adjs = await prisma.adjacency.findMany({
    where: {
      node_id: node.id,
    },
    include: {
      edge: {
        include: {
          building: true,
          floor: true,
          room: true,
          to_floor: true,
        },
      },
    },
  });

  return adjs.map((adj) => adj.edge);
};

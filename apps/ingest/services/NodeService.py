import sqlmodel

from services.BaseService import BaseService
from model.db.Node import Node
from model.db.Edge import Edge
from model.db.Adjacency import Adjacency

class NodeService(BaseService):
    def get_by_name(self, name: str) -> Node:
        with self._get_session() as session:
            statement = sqlmodel.select(Node).where(Node.name == name)
            node = session.exec(statement).first()

            return node

    def create(self, next_node: Node) -> Node:
        with self._get_session() as session:
            existing = sqlmodel.select(Node).where(Node.floor_id == next_node.floor_id).where(Node.building_id == next_node.building_id).where(Node.room_id == next_node.room_id)
            existing_node = session.exec(existing).first()

            if existing_node:
                node = existing_node
                for key, value in next_node.dict(exclude_unset=True).items():
                    setattr(existing_node, key, value)
            else:
                node = next_node

            session.add(node)
            session.commit()

            session.refresh(node)
            return node

    def add_edge(self, node: Node, edge: Edge):
        with self._get_session() as session:
            existing_query = sqlmodel.select(Adjacency).\
                where(Adjacency.node_id == node.id).\
                where(Adjacency.edge_id == edge.id)
            existing_adj = session.exec(existing_query).first()

            if existing_adj:
                return existing_adj

            adj = Adjacency(node_id=node.id, edge_id=edge.id)
            session.add(adj)
            session.commit()

            session.refresh(adj)

            return adj

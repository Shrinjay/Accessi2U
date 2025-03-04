import sqlmodel

from services.BaseService import BaseService
from model.db.Node import Node
from model.db.Edge import Edge
from model.db.Adjacency import Adjacency

class NodeService(BaseService):
    def create(self, node: Node) -> Node:
        with self._get_session() as session:
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

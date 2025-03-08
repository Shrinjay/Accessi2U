from services.BaseService import BaseService
from model.db.Edge import Edge
from model.db.Room import Room

import sqlmodel

class EdgeService(BaseService):
    def create(self, edge: Edge) -> Edge:
        with (self._get_session() as session):
            session.add(edge)
            session.commit()
            session.refresh(edge)

            return edge

    def get_by_room(self, room: Room):
        with (self._get_session() as session):
            statement = sqlmodel.select(Edge).where(Edge.room_id == room.id)
            edge = session.exec(statement).first()

            return edge


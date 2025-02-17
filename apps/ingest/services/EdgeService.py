from services.BaseService import BaseService
from model.db.Edge import Edge
from model.db.Room import Room

import sqlmodel

class EdgeService(BaseService):
    def upsert(self, next_edge: Edge):
        with (self._get_session() as session):
            existing = sqlmodel.select(Edge).\
            where(Edge.floor_id == next_edge.floor_id).\
            where(Edge.room_id == next_edge.room_id).\
            where(Edge.building_id == next_edge.building_id)

            existing_edge = session.exec(existing).first()
            # if we have an existing edge, use the id of that
            if existing_edge:
                edge = existing_edge
                for key, value in next_edge.dict(exclude_unset=True).items():
                    setattr(existing_edge, key, value)
            else:
                edge = next_edge

            session.add(edge)
            session.commit()

            session.refresh(edge)
            return edge

    def get_by_room(self, room: Room):
        with (self._get_session() as session):
            statement = sqlmodel.select(Edge).where(Edge.room_id == room.id)
            edge = session.exec(statement).first()

            return edge


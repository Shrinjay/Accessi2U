from services.BaseService import BaseService
from model.db.Room import Room

import sqlmodel

class RoomService(BaseService):
    def get_room_by_name(self, name: str):
        with self._get_session() as session:
            statement = sqlmodel.select(Room).where(Room.name == name)
            room = session.exec(statement).first()

            return room
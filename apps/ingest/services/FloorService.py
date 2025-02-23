from services.BaseService import BaseService
from model.db.Floor import Floor

import sqlmodel

class FloorService(BaseService):
    def get_floor_by_name(self, name: str):
        with self._get_session() as session:
            statement = sqlmodel.select(Floor).where(Floor.name == name)
            floor = session.exec(statement).first()

            return floor

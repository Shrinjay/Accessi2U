from services.BaseService import BaseService
from model.db.Building import Building

import sqlmodel

class BuildingService(BaseService):
    def get_building_by_name(self, name: str):
        with self._get_session() as session:
            statement = sqlmodel.select(Building).where(Building.name == name)
            building = session.exec(statement).first()

            return building
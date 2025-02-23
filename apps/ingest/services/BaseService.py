import sqlmodel
from common.db import engine

class BaseService:
    def _get_session(self):
        return sqlmodel.Session(engine)
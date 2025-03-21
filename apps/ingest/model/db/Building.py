import datetime

import sqlmodel
from sqlalchemy.sql import func
import typing


class Building(sqlmodel.SQLModel, table=True):
    """
    A building
    """
    id: typing.Optional[int] = sqlmodel.Field(primary_key=True, index=True, default=None)
    created_at: datetime.datetime = sqlmodel.Field(sa_column=sqlmodel.Column(sqlmodel.DateTime, default=func.now()))
    updated_at: datetime.datetime = sqlmodel.Field(sa_column=sqlmodel.Column(sqlmodel.DateTime, default=func.now()))

    name: str = sqlmodel.Field(max_length=255)
    centroid_lat: float = sqlmodel.Field()
    centroid_lon: float = sqlmodel.Field()
    area: float = sqlmodel.Field()
    rendering_entity_id: typing.Optional[int] = sqlmodel.Field(default=None, foreign_key="renderingentity.id")

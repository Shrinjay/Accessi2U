import datetime

import sqlmodel
from sqlalchemy.sql import func
import typing


class Floor(sqlmodel.SQLModel, table=True):
    """
    A floor
    """
    id: typing.Optional[int] = sqlmodel.Field(primary_key=True, index=True, default=None)
    created_at: datetime.datetime = sqlmodel.Field(sa_column=sqlmodel.Column(sqlmodel.DateTime, default=func.now()))
    updated_at: datetime.datetime = sqlmodel.Field(sa_column=sqlmodel.Column(sqlmodel.DateTime, default=func.now()))

    name: str = sqlmodel.Field(max_length=255)
    level: int = sqlmodel.Field()
    area: float = sqlmodel.Field()
    rendering_entity_id: typing.Optional[int] = sqlmodel.Field(default=None, foreign_key="renderingentity.id")
    building_id: typing.Optional[int] = sqlmodel.Field(
        default=None,
        foreign_key="building.id"
    )

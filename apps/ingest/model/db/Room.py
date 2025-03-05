import datetime

import sqlmodel
from sqlalchemy.sql import func
import typing


class Room(sqlmodel.SQLModel, table=True):
    """
    A room
    """
    id: typing.Optional[int] = sqlmodel.Field(primary_key=True, index=True, default=None)
    created_at: datetime.datetime = sqlmodel.Field(sa_column=sqlmodel.Column(sqlmodel.DateTime, default=func.now()))
    updated_at: datetime.datetime = sqlmodel.Field(sa_column=sqlmodel.Column(sqlmodel.DateTime, default=func.now()))

    name: str = sqlmodel.Field(max_length=255)
    rendering_entity_id: typing.Optional[int] = sqlmodel.Field(default=None, foreign_key="renderingentity.id")
    floor_id: typing.Optional[int] = sqlmodel.Field(
        default=None,
        foreign_key="floor.id"
    )
    room_type: str = sqlmodel.Field(default="unknown", max_length=255)

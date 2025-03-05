import datetime
import typing
import enum

import sqlalchemy
import sqlmodel
from sqlalchemy.sql import func

class EdgeTypeEnum(enum.Enum):
    REGULAR = "regular"
    INTER_FLOOR = "inter_floor"


class Edge(sqlmodel.SQLModel, table=True):
    id: typing.Optional[int] = sqlmodel.Field(primary_key=True, index=True, default=None)
    created_at: datetime.datetime = sqlmodel.Field(sa_column=sqlmodel.Column(sqlmodel.DateTime, default=func.now()))
    updated_at: datetime.datetime = sqlmodel.Field(sa_column=sqlmodel.Column(sqlmodel.DateTime, default=func.now()))


    edge_type: EdgeTypeEnum = sqlmodel.Field(sa_column=sqlalchemy.Column(sqlalchemy.Enum(EdgeTypeEnum)))
    room_id: typing.Optional[int] = sqlmodel.Field(default=None, foreign_key="room.id")
    building_id: typing.Optional[int] = sqlmodel.Field(default=None, foreign_key="building.id")
    floor_id: typing.Optional[int] = sqlmodel.Field(default=None, foreign_key="floor.id")
    to_floor_id: typing.Optional[int] = sqlmodel.Field(default=None, foreign_key="floor.id")

    __table_args__ = (
        sqlalchemy.UniqueConstraint('room_id', 'building_id', 'floor_id', name='uix_edge_room_building_floor'),
    )



import datetime
import typing
import enum

import sqlmodel
import sqlalchemy
from sqlalchemy.sql import func


class NodeTypeEnum(enum.Enum):
    """
    The type of a node
    """
    ROOM = "room"
    CONNECTION_POINT = "connection_point"
    STAIR = "stair"
    ELEVATOR = "elevator"

class Node(sqlmodel.SQLModel, table=True):
    id: typing.Optional[int] = sqlmodel.Field(primary_key=True, index=True, default=None)
    created_at: datetime.datetime = sqlmodel.Field(sa_column=sqlmodel.Column(sqlmodel.DateTime, default=func.now()))
    updated_at: datetime.datetime = sqlmodel.Field(sa_column=sqlmodel.Column(sqlmodel.DateTime, default=func.now()))

    node_type: NodeTypeEnum = sqlmodel.Field(sa_column=sqlalchemy.Column(sqlalchemy.Enum(NodeTypeEnum)))
    room_id: typing.Optional[int] = sqlmodel.Field(default=None, foreign_key="room.id")
    building_id: typing.Optional[int] = sqlmodel.Field(default=None, foreign_key="building.id")
    floor_id: typing.Optional[int] = sqlmodel.Field(default=None, foreign_key="floor.id")

    __table_args__ = (
        sqlalchemy.UniqueConstraint('room_id', 'building_id', 'floor_id', name='uix_node_room_building_floor'),
    )

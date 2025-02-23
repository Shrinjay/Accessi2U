import datetime
import typing

import sqlmodel
from sqlalchemy.sql import func


class Adjacency(sqlmodel.SQLModel, table=True):
    id: typing.Optional[int] = sqlmodel.Field(primary_key=True, index=True, default=None)
    created_at: datetime.datetime = sqlmodel.Field(sa_column=sqlmodel.Column(sqlmodel.DateTime, default=func.now()))
    updated_at: datetime.datetime = sqlmodel.Field(sa_column=sqlmodel.Column(sqlmodel.DateTime, default=func.now()))

    node_id: typing.Optional[int] = sqlmodel.Field(default=None, foreign_key="node.id")
    edge_id: typing.Optional[int] = sqlmodel.Field(default=None, foreign_key="edge.id")

    __table_args__ = (
        sqlmodel.UniqueConstraint('node_id', 'edge_id', name='uix_adjacency_node_edge'),
    )
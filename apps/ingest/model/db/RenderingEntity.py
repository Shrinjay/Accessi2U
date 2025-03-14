import datetime

import sqlmodel
from sqlalchemy.sql import func
import typing


class RenderingEntity(sqlmodel.SQLModel, table=True):
    """
    A rendering entity points to a file that contains a GeoJSON to render
    """
    id: typing.Optional[int] = sqlmodel.Field(primary_key=True, index=True, default=None)
    created_at: datetime.datetime = sqlmodel.Field(sa_column=sqlmodel.Column(sqlmodel.DateTime, default=func.now()))
    updated_at: datetime.datetime = sqlmodel.Field(sa_column=sqlmodel.Column(sqlmodel.DateTime, default=func.now()))

    parent_id: typing.Optional[int] = sqlmodel.Field(default=None, foreign_key="renderingentity.id")
    file_id: typing.Optional[int] = sqlmodel.Field(default=None, foreign_key="file.id")
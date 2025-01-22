import datetime

import sqlmodel
import typing


class RenderingEntity(sqlmodel.SQLModel, table=True):
    """
    A rendering entity points to a file that contains a GeoJSON to render
    """
    id: typing.Optional[int] = sqlmodel.Field(primary_key=True, index=True, default=None)
    created_at: datetime.datetime = sqlmodel.Field(default=datetime.datetime.now)
    updated_at: datetime.datetime = sqlmodel.Field(default=datetime.datetime.now)

    parent_id: typing.Optional[int] = sqlmodel.Field(default=None, foreign_key="RenderingEntity.id")
    file_id: typing.Optional[int] = sqlmodel.Field(default=None, foreign_key="File.id")
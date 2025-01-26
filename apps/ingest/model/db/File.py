import sqlmodel
import sqlalchemy
import typing
import datetime

from common.file_system import FileSystemEnum
from sqlalchemy.sql import func


class File(sqlmodel.SQLModel, table=True):
    """
    A generic pointer to a file that we store in our database
    This allows us to reference a file on local disk, on S3 etc. easily
    The backing storage logic is implemented in common/file_system
    """
    id: typing.Optional[int] = sqlmodel.Field(primary_key=True, default=None)
    created_at: datetime.datetime = sqlmodel.Field(sa_column=sqlmodel.Column(sqlmodel.DateTime, default=func.now()))
    updated_at: datetime.datetime = sqlmodel.Field(sa_column=sqlmodel.Column(sqlmodel.DateTime, default=func.now()))

    external_id: str = sqlmodel.Field(default=None)
    file_system: FileSystemEnum = sqlmodel.Field(sa_column=sqlalchemy.Column(sqlalchemy.Enum(FileSystemEnum), default=FileSystemEnum.LOCAL))
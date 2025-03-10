import sqlmodel

from common.file_system.LocalFileSystem import LocalFileSystem
from common.file_system import FileSystemEnum
from common.db import engine
from common.file_system.MinIOFileSystem import MinIOFileSystem

from model.db.File import File


class FileSystem:
    """
    Wraps the different file systems we have (e.g LocalFileSystem)
    You pass in a File object and based on the FileSystem it uses we delegate the read/write operations
    """
    def __init__(self):
        self.file_systems = {
            FileSystemEnum.LOCAL: LocalFileSystem(),
            FileSystemEnum.MINIO: MinIOFileSystem()
        }

    def create_dir(self, file_system: FileSystemEnum, path):
        return self.file_systems[file_system].create_dir(path)

    def exists(self, file: File):
        return self.file_systems[file.file_system].exists(file)

    def read(self, file: File):
        return self.file_systems[file.file_system].read(file)

    def write(self, file_system: FileSystemEnum, external_id: str, content) -> File:
        file = File(external_id=external_id, file_system=file_system)

        # write to file system
        self.file_systems[file.file_system].write(file, content)

        # save to database
        session = sqlmodel.Session(engine)

        with session:
            session.add(file)
            session.commit()
            session.refresh(file)

        return file

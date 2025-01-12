from common.file_system.LocalFileSystem import LocalFileSystem
from common.file_system import FileSystemEnum
from model.db.File import File


class FileSystem:
    def __init__(self):
        self.file_systems = {
            FileSystemEnum.LOCAL: LocalFileSystem()
        }

    def create_dir(self, file_system: FileSystemEnum, path):
        return self.file_systems[file_system].create_dir(path)

    def exists(self, file: File):
        return self.file_systems[file.file_system].exists(file)

    def read(self, file: File):
        return self.file_systems[file.file_system].read(file)

    def write(self, file_system: FileSystemEnum, external_id: str, content):
        file = File(external_id=external_id, file_system=file_system)

        self.file_systems[file.file_system].write(file, content)

        return file

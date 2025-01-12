import os

from common.file_system.AbstractFileSystem import AbstractFileSystem
from model.db.File import File


class LocalFileSystem(AbstractFileSystem):
    def create_dir(self, path):
        return os.makedirs(path, exist_ok=True)

    def exists(self, file: File):
        return os.path.exists(file.external_id)

    def read(self, file: File):
        with open(file.external_id, 'r') as f:
            return f.read()

    def write(self, file: File, content):
        with open(file.external_id, 'w') as f:
            f.write(content)

import abc

from model.db.File import File


class AbstractFileSystem(abc.ABC):
    @abc.abstractmethod
    def create_dir(self, path):
        pass

    @abc.abstractmethod
    def exists(self, file: File):
        pass

    @abc.abstractmethod
    def read(self, file: File):
        pass

    @abc.abstractmethod
    def write(self, file: File, content):
        pass
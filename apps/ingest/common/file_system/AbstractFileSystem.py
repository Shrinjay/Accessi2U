import abc

from model.db.File import File


class AbstractFileSystem(abc.ABC):
    """
    AbstractFileSystem defines the methods that a file system needs to implement
    We just need to pass in file objects containing a file system and external ID
    The FileSystem implementations (e.g LocalFileSystem) takes care of writing/reading the data
    """
    @abc.abstractmethod
    def create_dir(self, path):
        pass

    @abc.abstractmethod
    def exists(self, file: File) -> bool:
        pass

    @abc.abstractmethod
    def read(self, file: File) -> str:
        pass

    @abc.abstractmethod
    def write(self, file: File, content):
        pass

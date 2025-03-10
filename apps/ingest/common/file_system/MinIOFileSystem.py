import io

from common.file_system.AbstractFileSystem import AbstractFileSystem
from model.db.File import File
from common.env.env import MINIO_ACCESS_KEY_ID, MINIO_SECRET_ACCESS_KEY, MINIO_HOST, MINIO_BUCKET

from minio import Minio

class MinIOFileSystem(AbstractFileSystem):
    """
    FileSystem storing files on MinIO
    """
    def __init__(self):
        self.client = Minio(
            MINIO_HOST,
            access_key=MINIO_ACCESS_KEY_ID,
            secret_key=MINIO_SECRET_ACCESS_KEY,
            secure=True
        )

    def create_dir(self, path):
        return self.client.make_bucket(path)

    def exists(self, file: File):
        return self.client.bucket_exists(MINIO_BUCKET)

    def read(self, file: File) -> str:
        return self.client.get_object(MINIO_BUCKET, file.external_id).data.decode('utf-8')

    def write(self, file: File, content):
        self.client.put_object(MINIO_BUCKET, file.external_id, io.BytesIO(content.encode('utf-8')), len(content), 'text/plain')
from dotenv import dotenv_values
from urllib.parse import urlparse

values = dotenv_values(".env")
DATABASE_URL = values["DATABASE_URL"]
MINIO_ACCESS_KEY_ID = values["MINIO_ACCESS_KEY_ID"]
MINIO_SECRET_ACCESS_KEY = values["MINIO_SECRET_ACCESS_KEY"]
MINIO_HOST = values["MINIO_HOST"]
MINIO_BUCKET = values["MINIO_BUCKET"]

parsed_url = urlparse(DATABASE_URL)

DATABASE_USER = parsed_url.username
DATABASE_PASSWORD = parsed_url.password
DATABASE_HOST = parsed_url.hostname
DATABASE_NAME = parsed_url.path[1:]
DATABASE_PORT = parsed_url.port
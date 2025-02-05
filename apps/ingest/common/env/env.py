from dotenv import dotenv_values
from urllib.parse import urlparse

values = dotenv_values(".env")
DATABASE_URL = values["DATABASE_URL"]
parsed_url = urlparse(DATABASE_URL)

DATABASE_USER = parsed_url.username
DATABASE_PASSWORD = parsed_url.password
DATABASE_HOST = parsed_url.hostname
DATABASE_NAME = parsed_url.path[1:]
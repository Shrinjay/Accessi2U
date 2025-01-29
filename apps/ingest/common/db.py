import sqlmodel
from common.env.env import DATABASE_URL

engine = sqlmodel.create_engine(DATABASE_URL, pool_timeout=3000000)
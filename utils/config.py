from utils.functions import get_mysql_databases
from utils.settings import DATABASES


class Config():
    SQLALCHEMY_DATABASE_URI = get_mysql_databases(DATABASES)
    SQLALCHEMY_TRACK_MODIFICATIONS = False

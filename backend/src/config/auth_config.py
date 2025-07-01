import os

from authx import AuthXConfig, AuthX
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

auth_config = AuthXConfig(
    JWT_ALGORITHM="HS256",
    JWT_SECRET_KEY=os.getenv("SECRET_KEY"),
    JWT_TOKEN_LOCATION=["cookies"],
    JWT_ACCESS_COOKIE_NAME="access_token",
    JWT_ACCESS_TOKEN_EXPIRES=timedelta(days=7),
)




auth = AuthX(config=auth_config)

import os
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorGridFSBucket
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]

users_collection = db["users"]
materials_collection = db["materials"]
favourite_materials_collection = db["favourite"]
statistic_collection = db["statistic"]



data_upload_collection = db["upload"]

fs_bucket = AsyncIOMotorGridFSBucket(db)


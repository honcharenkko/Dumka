from bcrypt import gensalt, hashpw, checkpw

from src.mongo_db.db_connection import users_collection
from src.mongo_db.data_structures import User, ProfileUser


# Хеширование пароля
def hash_password(password: str) -> str:
    return hashpw(password.encode("utf-8"), gensalt()).decode("utf-8")


# Проверка пароля
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

#Пошук користувача
async def get_user(username: str):
    user = await users_collection.find_one({"username": username})
    if user:
        return User(**user)
    else:
        return None

async def get_user_data_profile(username: str):
    user = await users_collection.find_one(
        {"username": username},
        {"username": 1, "full_name": 1}
    )
    if user:
        return ProfileUser(**user)
    else:
        return None



async def get_user_data(username: str):
    user = await users_collection.find_one({"username": username})
    if user:
        return User(**user)
    return None



async def get_user_id(username: str):
    user = await users_collection.find_one({"username": username}, {"_id": 1})  # Отримуємо тільки _id
    if user:
        return user  # Повертаємо тільки _id
    else:
        return None

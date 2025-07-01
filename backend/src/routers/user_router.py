from authx import TokenPayload
from jose import jwt, JWTError
from src.functions.user_functions import get_user_data_profile, get_user_id
from src.mongo_db.db_connection import users_collection, materials_collection
from src.mongo_db.data_structures import User

from src.config.auth_config import auth


from fastapi import APIRouter, HTTPException, Depends, Request

from src.config.auth_config import auth_config


router = APIRouter(
    prefix="/user",
    tags= ["User"]
)

@router.get("/me")
async def get_current_user(user: TokenPayload = Depends(auth.access_token_required)):
    username = user.sub  # Отримуємо ім'я користувача з токена
    existing_user = await get_user_data_profile(username)
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    return existing_user



@router.get("/user")
async def get_user_data(id: str, request: Request, user: TokenPayload = Depends(auth.access_token_required)):

    # Перевіряємо, чи токен присутній
    token = request.cookies.get(auth_config.JWT_ACCESS_COOKIE_NAME)
    if not token:
        raise HTTPException(status_code=401, detail="Token is missing")

    # Отримуємо користувача за ID
    existing_user = await users_collection.find_one({"_id": id})

    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    return User(**existing_user)  # Повертаємо дані знайденого користувача





@router.get("/is_author")
async def get_is_author(request: Request, author_id: str):
    # Отримати токен з куків
    token = request.cookies.get(auth_config.JWT_ACCESS_COOKIE_NAME)
    if not token:
        raise HTTPException(status_code=401, detail="Token not provided")

    try:
        payload = jwt.decode(token, auth_config.JWT_SECRET_KEY, algorithms=["HS256"])
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    username = payload.get("sub")
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    # Знаходимо користувача за рядковим ID
    author = await users_collection.find_one({"_id": author_id})

    if not author:
        return {"is_author": False}

    # Порівнюємо username (email або логін)
    is_author = author.get("username") == username

    return {"is_author": is_author}



# @router.get("/user_id")
# async def get_current_user_id(request: Request ,user: TokenPayload = Depends(security.access_token_required)):
#     token = request.cookies.get(config.JWT_ACCESS_COOKIE_NAME)
#     username = user.sub  # Отримуємо ім'я користувача з токена
#     existing_user = await get_user_id(username)
#
#     payload = jwt.decode(token, config.JWT_SECRET_KEY, algorithms=["HS256"])
#     username1 = payload.get("sub")
#     existing_user1 = await get_user_id(username1)
#     if not existing_user:
#         raise HTTPException(status_code=404, detail="User not found")
#
#     return str(existing_user["_id"]), str(existing_user1["_id"])  # Повертаємо _id користувача як рядок


# @router.get("/get_all_user_data")
# async def get_all_users_materials(
#         user: TokenPayload = Depends(auth.access_token_required)
# ):
#     username = user.sub
#     existing_user = await get_user_id(username)
#
#     if not existing_user:
#         raise HTTPException(status_code=404, detail="User not found")
#
#     user_id = str(existing_user["_id"])
#
#     try:
#         # Використовуємо .to_list(None), щоб отримати список результатів
#         all_users_smart_cards = await materials_collection.find({"author_id": user_id}).to_list(None)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
#
#     if not all_users_smart_cards:
#         raise HTTPException(status_code=404, detail="No materials found for this user")
#
#     return all_users_smart_cards



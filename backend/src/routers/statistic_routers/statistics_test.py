from authx import TokenPayload
from bson import ObjectId
from jose import jwt
from src.functions.user_functions import get_user_id
from src.mongo_db.data_structures import StatisticTest
from src.mongo_db.db_connection import statistic_collection
from src.config.auth_config import auth
from fastapi import APIRouter, Depends, Request, HTTPException
from src.config.auth_config import auth_config

router = APIRouter(
    prefix="/statistic_test",
    tags= ["Statistic Test"]
)

@router.post("/insert_test_stat", response_model=StatisticTest)
async def create_test_stat(stat: StatisticTest, request: Request):
    token = request.cookies.get(auth_config.JWT_ACCESS_COOKIE_NAME)
    if not token:
        raise HTTPException(status_code=401, detail="Token missing")

    try:
        payload = jwt.decode(token, auth_config.JWT_SECRET_KEY, algorithms=["HS256"])
        username = payload.get("sub")
        existing_user = await get_user_id(username)

        if not existing_user:
            raise HTTPException(status_code=404, detail="User not found")

        user_id = str(existing_user["_id"])
        stat.user_id = user_id  # ✅ перезаписуємо user_id, щоб не було підміни


        existing = await statistic_collection.find_one({
            "user_id": user_id,
            "item_id": stat.item_id
        })
        if existing:
            raise HTTPException(status_code=409, detail="Статистика вже існує для цього користувача і матеріалу")

        await statistic_collection.insert_one(stat.dict())
        return stat
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.patch("/update_test_stat/{item_id}", response_model=StatisticTest)
async def update_test_stat(user_id: str, item_id: str, stat: StatisticTest, request: Request):
    token = request.cookies.get(auth_config.JWT_ACCESS_COOKIE_NAME)
    if not token:
        raise HTTPException(status_code=401, detail="Token missing")

    try:
        payload = jwt.decode(token, auth_config.JWT_SECRET_KEY, algorithms=["HS256"])
        username = payload.get("sub")
        existing_user = await get_user_id(username)

        if not existing_user:
            raise HTTPException(status_code=404, detail="User not found")

        user_id = str(existing_user["_id"])
        stat.user_id = user_id  # ✅ перезаписуємо user_id, щоб не було підміни

        result = await statistic_collection.find_one_and_update(
            {"user_id": user_id, "item_id": item_id},
            {"$set": stat.dict()},
        )
        if not result:
            raise HTTPException(status_code=404, detail="Статистика не знайдена")
        return result
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.get("/get_test_stat/{item_id}", response_model=StatisticTest)
async def get_test_stat(item_id: str, request: Request):
    token = request.cookies.get(auth_config.JWT_ACCESS_COOKIE_NAME)
    if not token:
        raise HTTPException(status_code=401, detail="Token missing")

    payload = jwt.decode(token, auth_config.JWT_SECRET_KEY, algorithms=["HS256"])
    username = payload.get("sub")
    existing_user = await get_user_id(username)
    user_id = str(existing_user["_id"])

    stat = await statistic_collection.find_one({"user_id": user_id, "item_id": item_id})
    if not stat:
        raise HTTPException(status_code=404, detail="Статистика не знайдена")
    stat["id"] = str(stat["_id"])

    return StatisticTest(**stat)


@router.delete("/delete_test_stat/{item_id}")
async def delete_cards_stat(item_id: str, request: Request):
    token = request.cookies.get(auth_config.JWT_ACCESS_COOKIE_NAME)
    if not token:
        raise HTTPException(status_code=401, detail="Token missing")

    try:
        payload = jwt.decode(token, auth_config.JWT_SECRET_KEY, algorithms=["HS256"])
        username = payload.get("sub")
        existing_user = await get_user_id(username)

        if not existing_user:
            raise HTTPException(status_code=404, detail="User not found")

        user_id = str(existing_user["_id"])

        result = await statistic_collection.delete_one({
            "user_id": user_id,
            "item_id": item_id
        })

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Статистика не знайдена")

        return {"message": "Статистика успішно видалена"}

    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
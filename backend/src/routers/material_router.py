from authx import TokenPayload
from bson import ObjectId
from jose import jwt
from src.functions.user_functions import get_user_id
from src.mongo_db.db_connection import users_collection, materials_collection, favourite_materials_collection, \
    statistic_collection
from src.config.auth_config import auth
from fastapi import APIRouter, Depends, Request, HTTPException
from src.config.auth_config import auth_config
from typing import Optional

router = APIRouter(
    prefix="/material",
    tags= ["Material"]
)

@router.get("/get_material")
async def get_all_materials(
        user: TokenPayload = Depends(auth.access_token_required)
):
    username = user.sub
    existing_user = await get_user_id(username)

    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    user_id = str(existing_user["_id"])

    try:
        # Використовуємо .to_list(None), щоб отримати список результатів
        all_users_smart_cards = await materials_collection.find({"author_id": user_id}).to_list(None)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if not all_users_smart_cards:
        raise HTTPException(status_code=404, detail="No materials found for this user")

    return all_users_smart_cards

@router.get("/get_all_users_materials")
async def get_all_users_materials(
        user: TokenPayload = Depends(auth.access_token_required),
        type: Optional[str] = None,
        search_query: Optional[str] = None,
        answer_format: Optional[str] = None,  # Фільтр за новими категоріями
        source: Optional[str] = None,
        text_style: Optional[str] = None,
        detail_level: Optional[str] = None,
        sort_by: Optional[str] = None,  # 'newest', 'oldest', 'alphabetical'
        limit: int = 20,
        skip: int = 0
):
    username = user.sub
    existing_user = await get_user_id(username)

    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    user_id = str(existing_user["_id"])

    # Базовий фільтр: не включати свої матеріали
    filter_criteria = {"author_id": {"$ne": user_id}}

    # Завжди додаємо пошук по темі (навіть без інших фільтрів)
    if search_query:
        filter_criteria["topic"] = {"$regex": search_query, "$options": "i"}

    # Додаємо фільтри тільки якщо вони передані
    if answer_format:
        filter_criteria["answer_format"] = answer_format
    if type:
        filter_criteria["type"] = type

    if source:
        filter_criteria["source"] = source

    if text_style:
        filter_criteria["text_style"] = text_style

    if detail_level:
        filter_criteria["detail_level"] = detail_level

    # Сортування
    sort_criteria = None
    if sort_by == "newest":
        sort_criteria = [("created_at", -1)]
    elif sort_by == "oldest":
        sort_criteria = [("created_at", 1)]
    elif sort_by == "alphabetical":
        sort_criteria = [("topic", 1)]

    try:
        query = materials_collection.find(filter_criteria)
        if sort_criteria:
            query = query.sort(sort_criteria)
        all_other_smart_cards = await query.skip(skip).limit(limit).to_list(length=None)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if not all_other_smart_cards:
        raise HTTPException(status_code=404, detail="No materials found")

    # Підтягуємо авторів
    author_ids = list({material["author_id"] for material in all_other_smart_cards})
    authors = await users_collection.find({"_id": {"$in": author_ids}}).to_list(length=None)
    author_map = {author["_id"]: author["full_name"] for author in authors}

    def serialize(doc):
        doc["author_name"] = author_map.get(doc["author_id"], "Unknown")

        # Сортування карток всередині
        if "flashcards" in doc and isinstance(doc["flashcards"], list):
            doc["flashcards"] = sorted(doc["flashcards"], key=lambda x: x.get("question", "").lower())

        return doc

    return [serialize(material) for material in all_other_smart_cards]


@router.get("/get_material/{material_id}")
async def get_material_by_id(material_id: str, user: TokenPayload = Depends(auth.access_token_required)):
    username = user.sub
    existing_user = await get_user_id(username)
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")
    try:
        material = await materials_collection.find_one({"_id": material_id})
        return material
    except Exception as e:
        raise HTTPException(status_code=404, detail= str(e))


@router.delete("/delete/{item_id}", response_model=dict)
async def delete_item(item_id: str, request: Request):
    token = request.cookies.get(auth_config.JWT_ACCESS_COOKIE_NAME)
    if not token:
        raise HTTPException(status_code=401, detail="Неавторизований доступ")

    # Розшифровка токена
    try:
        payload = jwt.decode(token, auth_config.JWT_SECRET_KEY, algorithms=["HS256"])
        username = payload.get("sub")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Невалідний токен")

    # Отримання ID користувача
    user_id = await get_user_id(username)
    if not user_id:
        raise HTTPException(status_code=404, detail="Користувача не знайдено")

    # Отримуємо матеріал
    item = await materials_collection.find_one({"_id": item_id})
    if not item:
        raise HTTPException(status_code=404, detail=f"Матеріал з ID {item_id} не знайдено")

    # Перевірка авторства
    if item["author_id"] != user_id["_id"]:
        raise HTTPException(status_code=403, detail="У вас немає прав на видалення цього матеріалу")

    # Видалення матеріалу
    result = await materials_collection.delete_one({"_id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=500, detail="Помилка при видаленні матеріалу")

    # Видалення всієї статистики по матеріалу
    stat_result = await statistic_collection.delete_many({"item_id": item_id})

    # Видалення з улюбленого
    fav_result = await favourite_materials_collection.delete_many({"item_id": item_id})

    return {
        "message": (
            f"Матеріал з ID {item_id} успішно видалено. "
            f"Видалено {stat_result.deleted_count} запис(ів) статистики та "
            f"{fav_result.deleted_count} запис(ів) з обраного."
        )
    }






@router.post("/add_material_to_favorites/{item_id}")
async def add_material_to_favorites(item_id: str, request: Request):
    # Отримуємо токен з куків
    token = request.cookies.get(auth_config.JWT_ACCESS_COOKIE_NAME)
    if not token:
        raise HTTPException(status_code=401, detail="Token missing")

    try:
        # Розшифровуємо токен та отримуємо користувача
        payload = jwt.decode(token, auth_config.JWT_SECRET_KEY, algorithms=["HS256"])
        username = payload.get("sub")
        existing_user = await get_user_id(username)
        if not existing_user:
            raise HTTPException(status_code=404, detail="User not found")

        user_id = str(existing_user["_id"])

        # Шукаємо матеріал за item_id, щоб отримати author_id
        material = await materials_collection.find_one({"_id": item_id})
        if not material:
            raise HTTPException(status_code=404, detail="Material not found")

        # Отримуємо author_id з матеріалу
        author_id = material.get("author_id")
        if not author_id:
            raise HTTPException(status_code=404, detail="Author not found")

        # Створюємо об'єкт для збереження у базі
        saved = {
            "_id": str(ObjectId()),
            "user_id": user_id,
            "item_id": item_id,
            "author_id": author_id
        }

        # Перевірка чи вже є цей матеріал в обраному
        existing_fav = await favourite_materials_collection.find_one(saved)
        if existing_fav:
            raise HTTPException(status_code=400, detail="Вже додано до обраного")

        # Додаємо матеріал в обране
        await favourite_materials_collection.insert_one(saved)
        return {"message": "Додано до обраного"}

    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")



@router.post("/remove_material_from_favorites/{item_id}")
async def remove_material_from_favorites(item_id: str, request: Request):
    # Отримуємо токен з куків
    token = request.cookies.get(auth_config.JWT_ACCESS_COOKIE_NAME)
    if not token:
        raise HTTPException(status_code=401, detail="Token missing")

    try:
        # Розшифровуємо токен та отримуємо користувача
        payload = jwt.decode(token, auth_config.JWT_SECRET_KEY, algorithms=["HS256"])
        username = payload.get("sub")
        existing_user = await get_user_id(username)
        if not existing_user:
            raise HTTPException(status_code=404, detail="User not found")

        user_id = str(existing_user["_id"])

        # Перевірка, чи матеріал знаходиться в обраному для цього користувача
        existing_fav = await favourite_materials_collection.find_one({
            "user_id": user_id,
            "item_id": item_id
        })

        if not existing_fav:
            raise HTTPException(status_code=404, detail="Material is not in favorites")

        # Видаляємо матеріал з обраного
        await favourite_materials_collection.delete_one({
            "user_id": user_id,
            "item_id": item_id
        })

        return {"message": "Матеріал видалено з обраного"}

    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")



@router.get("/get_favourite_materials")
async def get_user_favorites(request: Request):
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

        # Отримуємо всі улюблені матеріали для user_id
        favorites = await favourite_materials_collection.find({"user_id": user_id}).to_list(length=None)

        # Тут важливо: item_id — як str
        items_ids = [fav["item_id"] for fav in favorites if "item_id" in fav]

        # Тут теж: _id порівнюється зі str
        materials = await materials_collection.find({"_id": {"$in": items_ids}}).to_list(length=None)

        # Збираємо всі унікальні author_id як str
        author_ids = list({material["author_id"] for material in materials})

        # Запитуємо авторів як str
        authors = await users_collection.find({"_id": {"$in": author_ids}}).to_list(length=None)
        author_map = {author["_id"]: author["full_name"] for author in authors}

        def serialize(doc):
            doc["author_name"] = author_map.get(doc["author_id"], "Unknown")
            return doc

        return [serialize(material) for material in materials]

    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

from fastapi import APIRouter, HTTPException, Response, Request
from bson import ObjectId
from pymongo.errors import ServerSelectionTimeoutError, PyMongoError

from src.functions.user_functions import get_user, hash_password, verify_password
from src.mongo_db.db_connection import users_collection
from src.mongo_db.data_structures import User, LoginUser
from src.config.auth_config import auth, auth_config


router = APIRouter(
    prefix="/auth",
    tags= ["Auth"]
)


# Регистрация пользователя
@router.post("/signup")
async def register(user_data: User):
    try:
        # Перевірка на наявність користувача з таким username
        existing_user = await get_user(user_data.username)


        # Хешування пароля
        hashed_password = hash_password(user_data.password)

        # Створення нового користувача
        new_user = {
            "_id": str(ObjectId()),
            "full_name": user_data.full_name,
            "username": user_data.username,
            "password": hashed_password,
        }

        # Вставка нового користувача в базу даних
        await users_collection.insert_one(new_user)

        return {"message": "User registered successfully"}



    except ServerSelectionTimeoutError:
        # Помилка підключення до MongoDB (тайм-аут)
        raise HTTPException(status_code=503, detail="Час підключення до бази даних вичерпано. Спробуйте пізніше.")

    except ConnectionError:
        # Помилка з'єднання з MongoDB
        raise HTTPException(status_code=503, detail="Помилка підключення до бази даних. Перевірте сервер MongoDB.")

    except PyMongoError:
        # Помилка роботи з MongoDB
        raise HTTPException(status_code=500, detail="Виникла помилка при роботі з базою даних. Спробуйте пізніше.")

    except Exception as e:
        # Непередбачена помилка
        raise HTTPException(status_code=500, detail=f"Виникла непередбачена помилка: {str(e)}. Спробуйте пізніше.")



@router.post('/login')
async def login(user_data: LoginUser, response: Response):
    try:
        # Пошук користувача в базі даних
        existing_user = await get_user(user_data.username)

        if existing_user and verify_password(user_data.password, existing_user.password):
            access_token = auth.create_access_token(uid=user_data.username)
            response.set_cookie(auth_config.JWT_ACCESS_COOKIE_NAME, access_token)
            return {"access_token": access_token}

        # Якщо користувач знайдений, але пароль неправильний
        raise HTTPException(401, detail="Невірний логін або пароль")

    except ServerSelectionTimeoutError:
        # Помилка підключення до MongoDB (тайм-аут)
        raise HTTPException(status_code=503, detail="Час підключення до бази даних вичерпано. Спробуйте пізніше.")

    except ConnectionError:
        # Помилка з'єднання з MongoDB
        raise HTTPException(status_code=503, detail="Помилка підключення до бази даних. Перевірте сервер MongoDB.")

    except PyMongoError:
        # Помилка роботи з MongoDB
        raise HTTPException(status_code=500, detail="Виникла помилка при роботі з базою даних. Спробуйте пізніше.")

    except Exception:
        # Непередбачена помилка
        raise HTTPException(status_code=500, detail="Виникла непередбачена помилка. Спробуйте пізніше.")


@router.post('/logout')
async def logout(request: Request, response: Response):
    token = request.cookies.get(auth_config.JWT_ACCESS_COOKIE_NAME)
    if not token:
        raise HTTPException(status_code=401, detail="No authentication token found. Unable to logout.")
    else:
        response.delete_cookie(auth_config.JWT_ACCESS_COOKIE_NAME)
        return {"message": "Logged out successfully"}






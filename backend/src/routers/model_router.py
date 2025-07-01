from authx.exceptions import MissingTokenError
from fastapi.encoders import jsonable_encoder
from jose import jwt

from src.functions.user_functions import get_user_id
from src.llm_pipeline.input_model import FlashcardGenerationInput, FlashcardGeneration, TestQuestionGeneration, \
    TestGenerationInput, SummaryGenerationInput, SummaryGeneration
from src.llm_pipeline.llm_generator import generate
from src.config.auth_config import auth_config
from src.llm_pipeline.prompts import smart_card_query, test_query, summary_query
from src.llm_pipeline.rag_llm_generation import rag_generate

from src.mongo_db.db_connection import materials_collection

from fastapi import APIRouter, Request, HTTPException, status
from bson import ObjectId
from datetime import datetime
from pydantic import ValidationError
from src.mongo_db.data_structures import Flashcard, TestQuestion, Summary

model_router = APIRouter(
    tags= ["LLM"]
)

@model_router.post("/generate_cards")
async def smart_cards_generate(input_data: FlashcardGenerationInput, request: Request):
    token = request.cookies.get(auth_config.JWT_ACCESS_COOKIE_NAME)

    if not token:
        raise MissingTokenError()

    try:
        result = await smart_card_query(
            input_data.topic,
            input_data.num_cards,
            input_data.text_style,
            input_data.detail_level,
            input_data.answer_format
        )
        return await generate(result, FlashcardGeneration)

    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )

    except:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while generating flashcards"
        )

@model_router.post("/generate_test")
async def test_generate(input_data: TestGenerationInput, request: Request):
    token = request.cookies.get(auth_config.JWT_ACCESS_COOKIE_NAME)

    if not token:
        raise MissingTokenError()

    try:
        result = await test_query(
            input_data.topic,
            input_data.num_questions,
            input_data.text_style,
            input_data.detail_level,
            input_data.answer_format
        )
        return await generate(result, TestQuestionGeneration)

    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )

    except:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while generating test"
        )

@model_router.post("/generate_summary")
async def test_generate(input_data: SummaryGenerationInput, request: Request):
    token = request.cookies.get(auth_config.JWT_ACCESS_COOKIE_NAME)

    if not token:
        raise MissingTokenError()

    try:
        result = await summary_query(
            input_data.topic,
            input_data.num_paragraphs,
            input_data.text_style,
            input_data.detail_level
        )
        return await generate(result, SummaryGeneration)

    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )

    except:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while generating test"
        )




# Зберігання матеріалів
@model_router.post("/save_smart_cards")
async def smart_cards_save(
    input_data: Flashcard,
    request: Request,
):
    # Отримання токена
    token = request.cookies.get(auth_config.JWT_ACCESS_COOKIE_NAME)
    if not token:
        raise HTTPException(status_code=401, detail="Token missing")

    try:
        # Розшифровуємо токен
        payload = jwt.decode(token, auth_config.JWT_SECRET_KEY, algorithms=["HS256"])
        username = payload.get("sub")

        # Отримання користувача за username
        existing_user = await get_user_id(username)
        if not existing_user:
            raise HTTPException(status_code=404, detail="User not found")

        new_type = "smart_cards"

        # Переконуємося, що `created_at` є або генеруємо його
        created_at = str(datetime.utcnow())

        # Підставляємо author_id безпосередньо з користувача
        author_id = str(existing_user["_id"])  # Завжди використовуємо _id з користувача

        # Створення нового екземпляра Flashcard
        flashcard_data = Flashcard(
            type = new_type,
            author_id=author_id,
            source = input_data.source,
            created_at=created_at,
            topic=input_data.topic,
            num_cards=input_data.num_cards,
            text_style=input_data.text_style,
            detail_level=input_data.detail_level,
            answer_format=input_data.answer_format,
            flashcards=input_data.flashcards
        )

        serialized_flashcards = [jsonable_encoder(item) for item in flashcard_data.flashcards]

        # Формування документа для MongoDB
        new_smart_card = {
            "_id": str(ObjectId()),  # Генерація MongoDB ID
            "type": flashcard_data.type,  # Тип матеріалу
            "author_id": flashcard_data.author_id,  # Автор ID з токену
            "source": flashcard_data.source,
            "created_at": flashcard_data.created_at,
            "topic": flashcard_data.topic,
            "num_cards": flashcard_data.num_cards,
            "text_style": flashcard_data.text_style,
            "detail_level": flashcard_data.detail_level,
            "answer_format": flashcard_data.answer_format,
            "flashcards": serialized_flashcards  # Перелік карток
        }

        # Збереження в базі даних
        await materials_collection.insert_one(new_smart_card)

        return {"message": "Material added successfully", "id": new_smart_card["_id"]}

    except ValidationError as ve:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(ve)
        )
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@model_router.post("/save_smart_test")
async def smart_test_save(
    input_data: TestQuestion,
    request: Request,
):
    # Отримання токена
    token = request.cookies.get(auth_config.JWT_ACCESS_COOKIE_NAME)
    if not token:
        raise HTTPException(status_code=401, detail="Token missing")

    try:
        # Розшифровуємо токен
        payload = jwt.decode(token, auth_config.JWT_SECRET_KEY, algorithms=["HS256"])
        username = payload.get("sub")

        # Отримання користувача за username
        existing_user = await get_user_id(username)
        if not existing_user:
            raise HTTPException(status_code=404, detail="User not found")

        new_type = "smart_test"

        # Переконуємося, що `created_at` є або генеруємо його
        created_at = str(datetime.utcnow())

        # Підставляємо author_id безпосередньо з користувача
        author_id = str(existing_user["_id"])  # Завжди використовуємо _id з користувача

        # Створення нового екземпляра TestQuestion
        test_data = TestQuestion(
            type = new_type,
            author_id=author_id,
            source = input_data.source,
            created_at=created_at,
            topic=input_data.topic,
            num_questions=input_data.num_questions,
            text_style=input_data.text_style,
            detail_level=input_data.detail_level,
            answer_format=input_data.answer_format,
            questions=input_data.questions
        )

        serialized_questions = [jsonable_encoder(item) for item in test_data.questions]

        # Формування документа для MongoDB
        new_smart_test = {
            "_id": str(ObjectId()),  # Генерація MongoDB ID
            "type": test_data.type,  # Тип матеріалу
            "author_id": test_data.author_id,  # Автор ID з токену
            "source": test_data.source,
            "created_at": test_data.created_at,
            "topic": test_data.topic,
            "num_questions": test_data.num_questions,
            "text_style": test_data.text_style,
            "detail_level": test_data.detail_level,
            "answer_format": test_data.answer_format,
            "questions": serialized_questions  # Перелік карток
        }

        # Збереження в базі даних
        await materials_collection.insert_one(new_smart_test)

        return {"message": "Material added successfully", "id": new_smart_test["_id"]}

    except ValidationError as ve:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(ve)
        )
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@model_router.post("/save_smart_summary")
async def smart_test_save(
    input_data: Summary,
    request: Request,
):
    # Отримання токена
    token = request.cookies.get(auth_config.JWT_ACCESS_COOKIE_NAME)
    if not token:
        raise HTTPException(status_code=401, detail="Token missing")

    try:
        # Розшифровуємо токен
        payload = jwt.decode(token, auth_config.JWT_SECRET_KEY, algorithms=["HS256"])
        username = payload.get("sub")

        # Отримання користувача за username
        existing_user = await get_user_id(username)
        if not existing_user:
            raise HTTPException(status_code=404, detail="User not found")

        new_type = "smart_summary"

        # Переконуємося, що `created_at` є або генеруємо його
        created_at = str(datetime.utcnow())

        # Підставляємо author_id безпосередньо з користувача
        author_id = str(existing_user["_id"])  # Завжди використовуємо _id з користувача

        # Створення нового екземпляра TestQuestion
        summary_data = Summary(
            type = new_type,
            author_id=author_id,
            source= input_data.source,
            created_at=created_at,
            topic=input_data.topic,
            num_paragraphs=input_data.num_paragraphs,
            text_style=input_data.text_style,
            detail_level=input_data.detail_level,
            paragraphs=input_data.paragraphs
        )

        serialized_paragraphs = [jsonable_encoder(item) for item in summary_data.paragraphs]

        # Формування документа для MongoDB
        new_smart_summary = {
            "_id": str(ObjectId()),  # Генерація MongoDB ID
            "type": summary_data.type,  # Тип матеріалу
            "author_id": summary_data.author_id,  # Автор ID з токену
            "source": summary_data.source,
            "created_at": summary_data.created_at,
            "topic": summary_data.topic,
            "num_paragraphs": summary_data.num_paragraphs,
            "text_style": summary_data.text_style,
            "detail_level": summary_data.detail_level,
            "paragraphs": serialized_paragraphs
        }

        # Збереження в базі даних
        await materials_collection.insert_one(new_smart_summary)

        return {"message": "Material added successfully", "id": new_smart_summary["_id"]}

    except ValidationError as ve:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(ve)
        )
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
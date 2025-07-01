import mimetypes
from typing import List

from fastapi import APIRouter, UploadFile, File, Form
from starlette.responses import StreamingResponse

from src.mongo_db.data_structures import FileMetadata
from src.mongo_db.db_connection import fs_bucket, data_upload_collection
from jose import jwt
from src.functions.user_functions import get_user_id
from src.config.auth_config import auth_config
from fastapi import APIRouter, Request, HTTPException
from bson import ObjectId




router = APIRouter(
    prefix="/library",
    tags= ["Data Upload"]
)

@router.post("/upload")
async def upload_file(request: Request, title: str = Form(...), file: UploadFile = File(...)):
    # Отримання токена
    token = request.cookies.get(auth_config.JWT_ACCESS_COOKIE_NAME)
    if not token:
        raise HTTPException(status_code=401, detail="Token missing")

        # Розшифровуємо токен
    payload = jwt.decode(token, auth_config.JWT_SECRET_KEY, algorithms=["HS256"])
    username = payload.get("sub")

        # Отримання користувача за username
    existing_user = await get_user_id(username)
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Підставляємо author_id безпосередньо з користувача
    author_id = str(existing_user["_id"])  # Завжди використовуємо _id з користувача


    file_data = await file.read()

    # Зберігаємо файл у GridFS
    file_id = await fs_bucket.upload_from_stream(file.filename, file_data)

    # Зберігаємо метадані
    document = {
        "_id": str(ObjectId()),
        "title": title,
        "author_id": author_id,
        "filename": file.filename,
        "file_id": file_id,
    }
    result = await data_upload_collection.insert_one(document)
    return {"message": "Файл збережено у GridFS", "id": str(result.inserted_id)}


@router.get("/list", response_model=List[FileMetadata])
async def get_user_files(request: Request):
    # Отримання токена з cookies
    token = request.cookies.get(auth_config.JWT_ACCESS_COOKIE_NAME)
    if not token:
        raise HTTPException(status_code=401, detail="Token missing")

    # Розшифровка токена
    try:
        payload = jwt.decode(token, auth_config.JWT_SECRET_KEY, algorithms=["HS256"])
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    username = payload.get("sub")
    if not username:
        raise HTTPException(status_code=400, detail="Invalid payload")

    # Отримання користувача
    existing_user = await get_user_id(username)
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    author_id = str(existing_user["_id"])

    # Отримання файлів користувача
    files_raw = await data_upload_collection.find({"author_id": author_id}).to_list(length=100)

    # Конвертація ObjectId у str
    files = [
        {
            **f,
            "_id": str(f["_id"]),
            "file_id": str(f["file_id"])
        }
        for f in files_raw
    ]

    return files


@router.get("/download/{file_id}")
async def download_file(file_id: str):
    try:
        file_id = ObjectId(file_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid file ID")

    file = await data_upload_collection.fs.files.find_one({"_id": file_id})
    if not file:
        raise HTTPException(status_code=404, detail="File not found in GridFS")

    grid_out = await data_upload_collection.fs.open_download_stream(file_id)

    # Визначаємо MIME тип за назвою файлу
    mime_type, _ = mimetypes.guess_type(file["filename"])
    if not mime_type:
        mime_type = "application/octet-stream"

    headers = {
        "Content-Disposition": f'inline; filename="{file["filename"]}"'
    }

    return StreamingResponse(
        grid_out,
        media_type=mime_type,
        headers=headers,
    )
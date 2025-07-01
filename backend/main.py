from authx.exceptions import MissingTokenError
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
from src.routers.statistic_routers.statistics_cards import router as statistic_cards_router
from src.routers.statistic_routers.statistics_test import router as statistic_test_router
from src.routers.model_router import model_router
from src.routers.rag_model_router import router as rag_model_router
from src.routers.auth_router import router as auth_router
from src.routers.user_router import router as user_router
from src.routers.material_router import router as material_router
from src.routers.data_upload_router import router as data_upload_router

import httpx
app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
"http://192.168.0.51:5173",
"http://localhost:3000",
    "http://frontend:80"

]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(MissingTokenError)
async def missing_token_exception_handler(request, exc):
    return JSONResponse(
        status_code=401,
        content={"detail": "Missing authentication token. Please log in."},
    )

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(model_router)
app.include_router(rag_model_router)
app.include_router(material_router)
app.include_router(statistic_cards_router)
app.include_router(statistic_test_router)
app.include_router(data_upload_router)





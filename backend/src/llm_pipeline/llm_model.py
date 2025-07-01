import os
from dotenv import load_dotenv
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.chat_models import ChatOpenAI

load_dotenv()

class Model:
    def __init__(self):
        # Підключення embeddings через LangChain адаптер
        self.embeddings_model = HuggingFaceEmbeddings(
            model_name='sentence-transformers/all-MiniLM-L6-v2'
        )

        # Використання DeepSeek LLM через OpenAI-сумісний API
        self.model_deep_seek = ChatOpenAI(
            model="deepseek-chat",
            temperature=1.5,
            openai_api_base="https://api.deepseek.com/v1",  # Цей URL незмінний
            openai_api_key=os.getenv("DEEPSEEK_API_KEY")  # API-ключ беремо з .env
        )





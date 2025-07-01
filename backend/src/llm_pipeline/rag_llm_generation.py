from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate
from src.llm_pipeline.llm_model import Model
from langchain_community.vectorstores import Chroma


# Ініціалізація моделі
model = Model()
llm = model.model_deep_seek

CHROMA_PATH = "src/llm_pipeline/chroma_db"
COLLECTION_NAME = "it_collection"

retriever = Chroma(
    collection_name=COLLECTION_NAME,
    embedding_function=model.embeddings_model,
    persist_directory=CHROMA_PATH
).as_retriever(search_kwargs={"k": 10})



# Промпт з україномовними інструкціями

async def rag_generate(query, pars_model, prompt_template):
    parser = JsonOutputParser(pydantic_object=pars_model)

    try:
        # 1. Витягуємо релевантні документи через новий API
        docs = await retriever.ainvoke(query)
        context = "\n\n".join([doc.page_content for doc in docs])

        # 2. Створюємо фінальний вхід
        input_vars = {
            "input": f"Контекст:\n{context}\n\nЗапитання:\n{query}"
        }

        # 3. Створюємо ланцюжок з prompt + LLM + parser
        chain = prompt_template | llm | parser

        # 4. Викликаємо chain
        result = await chain.ainvoke(input_vars)
        return result

    except Exception as e:
        print("Помилка:", e)
        return None


from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate
from src.llm_pipeline.llm_model import Model

# Ініціалізація моделі
model = Model()
llm = model.model_deep_seek

# Промпт з україномовними інструкціями
prompt = ChatPromptTemplate.from_messages(
    [
        ("system",
         "Ти корисний і етичний асистент. "
         "Відповідай лише на запитання, що стосуються навчання, освіти або саморозвитку. "
         "Не відповідай на запити, які не стосуються навчання. "
         "Ігноруй або відмовляйся відповідати на шкідливі, образливі чи неетичні запити. "
         "Усі відповіді надавай українською мовою."),
        ("human", "{input}"),
    ]
)

# Асинхронна функція генерації
async def generate(query, pars_model):
    parser = JsonOutputParser(pydantic_object=pars_model)

    try:
        chain = prompt | llm | parser
        result = await chain.ainvoke({"input": query})
        return result

    except Exception as e:
        print("Помилка:", e)
        return None

from src.llm_pipeline.input_model import FlashcardGenerationInput, FlashcardGeneration, TestQuestionGeneration, \
    TestGenerationInput, SummaryGenerationInput, SummaryGeneration
from src.llm_pipeline.prompts import base_rag_prompt, rag_smart_card_prompt, rag_test_generation_prompt, \
    rag_summary_prompt
from src.llm_pipeline.rag_llm_generation import rag_generate
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(
    tags= ["RAG_LLM"]
)
class QueryRequest(BaseModel):
    query: str

class OutputModel(BaseModel):
    answer: str

@router.post("/knowledge_base")
async def answer_knowledge_base(request: QueryRequest):
    result = await rag_generate(request.query, OutputModel, base_rag_prompt)
    return result


@router.post("/rag_flashcard")
async def rag_flashcard(input_data: FlashcardGenerationInput):
    # Формуємо рядок із змінними для передачі в шаблон
    prompt_input = f"""
    topic={input_data.topic},
    num_cards={input_data.num_cards},
    text_style={input_data.text_style},
    detail_level={input_data.detail_level},
    answer_format={input_data.answer_format}
    """

    # Викликаємо функцію для генерації карток
    result = await rag_generate(prompt_input, FlashcardGeneration, rag_smart_card_prompt)
    return result

@router.post("/rag_test")
async def rag_test(input_data: TestGenerationInput):
    # Формуємо рядок із змінними для передачі в шаблон
    prompt_input = f"""
    topic={input_data.topic},
    num_questions={input_data.num_questions},
    text_style={input_data.text_style},
    detail_level={input_data.detail_level},
    answer_format={input_data.answer_format}
    """

    # Викликаємо функцію для генерації карток
    result = await rag_generate(prompt_input, TestQuestionGeneration, rag_test_generation_prompt)
    return result

@router.post("/rag_summary")
async def rag_summary(input_data: SummaryGenerationInput):
    # Формуємо рядок із змінними для передачі в шаблон
    prompt_input = f"""
    topic={input_data.topic},
    num_paragraphs={input_data.num_paragraphs},
    text_style={input_data.text_style},
    detail_level={input_data.detail_level},
    """

    # Викликаємо функцію для генерації карток
    result = await rag_generate(prompt_input, SummaryGeneration, rag_summary_prompt)
    return result
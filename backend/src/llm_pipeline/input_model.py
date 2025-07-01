from pydantic import BaseModel, Field

class FlashcardGenerationInput(BaseModel):
    topic: str
    num_cards: int
    text_style: str
    detail_level: str
    answer_format: str

# Поля підказки для моделі
class Flashcard(BaseModel):
    question: str = Field(description="Question on the flashcard")
    answer: str = Field(description="Answer on the flashcard")

class FlashcardGeneration(BaseModel):
    topic: str = Field(description="Topic of the flashcards")
    num_cards: int = Field(gt=0, le=15, description="Number of flashcards")
    text_style: str = Field(description="Text style (Formal, Conversational, Simple)")
    detail_level: str = Field(description="Level of detail in explanations (short, detailed)")
    answer_format: str = Field(description="Type of flashcards (Factual knowledge, Concept explanations, Practical applications, Problem-solving scenarios)")
    flashcards: list[Flashcard] = Field(description="List of generated flashcards")




class TestGenerationInput(BaseModel):
    topic: str
    num_questions: int
    text_style: str
    detail_level: str
    answer_format: str

class TestQuestionItem(BaseModel):
    question: str = Field(description="Question in the test")
    options: list[str] = Field(description="List of possible answer choices")
    correct_option: int = Field(description="Index of the correct answer (0-based index)")

class TestQuestionGeneration(BaseModel):
    topic: str = Field(description="Topic of the test questions")
    num_questions: int = Field(gt=0, le=15, description="Number of test questions")
    text_style: str = Field(description="Text style (Formal, Conversational, Simple)")
    detail_level: str = Field(description="Level of detail in explanations (short, detailed)")
    answer_format: str = Field(description="Type of questions (Multiple choice, True/False, Fill in the blank, etc.)")
    questions: list[TestQuestionItem] = Field(description="List of generated test questions")




class SummaryGenerationInput(BaseModel):
    topic: str
    num_paragraphs: int
    text_style: str
    detail_level: str

class SummaryParagraphInput(BaseModel):
    topic: str = Field(description="Topic of paragraph")
    text: str = Field(description="Paragraph text")

class SummaryGeneration(BaseModel):
    topic: str = Field(description="Topic of the summary")
    num_paragraphs: int = Field(gt=0, le=5, description="Number of paragraphs")
    text_style: str = Field(description="Text style (Formal, Conversational, Simple)")
    detail_level: str = Field(description="Level of detail in explanations (short, detailed)")
    paragraphs: list[SummaryParagraphInput] = Field(description="List of generated summary paragraphs")

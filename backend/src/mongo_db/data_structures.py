from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field

class MaterialType(str, Enum):
    FLASHCARDS = "flashcards"
    TEST_QUESTIONS = "test_questions"

class RefreshForm(BaseModel):
    refresh_token: str

class LoginUser(BaseModel):
    username: str
    password: str

class User(LoginUser):
    full_name: str

class ProfileUser(BaseModel):
    full_name: str
    username: str

class Material(BaseModel):
    type: str
    author_id: str
    created_at: str
    source: str


class FlashcardItem(BaseModel):
    question: str
    answer: str

class Flashcard(Material):
    topic: str
    num_cards: int = Field(gt=4, le=15, description="Number of flashcards (must be between 5 and 15)")
    text_style: str
    detail_level: str
    answer_format: str
    flashcards: List[FlashcardItem]



class TestQuestionItem(BaseModel):
    question: str
    options: List[str]
    correct_option: int

class TestQuestion(Material):
    topic: str
    num_questions: int = Field(gt=4, le=15, description="Number of questions (must be between 5 and 15)")
    text_style: str
    detail_level: str
    answer_format: str
    questions: List[TestQuestionItem]


class SummaryItem(BaseModel):
    topic: str
    text: str

class Summary(Material):
    topic: str
    num_paragraphs: int = Field(gt=0, le=5, description="Number of paragraphs (must be between 1 and 5)")
    text_style: str
    detail_level: str
    paragraphs: List[SummaryItem]



class FavouriteItem(BaseModel):
    user_id: str
    item_id: str
    author_id: str


class FileMetadata(BaseModel):
    _id: str
    title: str
    author_id: str
    filename: str
    file_id: str


class StatisticBase(BaseModel):
    user_id: str
    item_id: str  # ID матеріалу
    author_id: str

class StatisticSmartCards(StatisticBase):
    known_cards: List[str] = Field(default_factory=list)
    need_to_remind: List[str] = Field(default_factory=list)
    unknown_cards: List[str] = Field(default_factory=list)
    completed: bool = False

class StatisticTest(StatisticBase):
    correct_answers: List[str] = Field(default_factory=list)
    incorrect_answers: List[str] = Field(default_factory=list)
    completed: bool = False


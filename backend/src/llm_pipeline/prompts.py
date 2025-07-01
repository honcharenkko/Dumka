from langchain.chains.conversational_retrieval.base import ConversationalRetrievalChain
from langchain_core.language_models import BaseLanguageModel
from langchain_core.prompts import ChatPromptTemplate


async def smart_card_query(topic: str, num_cards: int, text_style: str, detail_level: str, answer_format: str):
    query = (
        f"Generate {num_cards} structured flashcards for the topic '{topic}'.\n"
        f"Flashcards should be written in a '{text_style}' style with '{detail_level}' detail level.\n"
        f"The focus of the flashcards should be '{answer_format}'.\n\n"
        "The response must be a complete JSON object with all fields:\n\n"
        "{\n"
        f'  "topic": "{topic}",\n'
        f'  "num_cards": {num_cards},\n'
        f'  "text_style": "{text_style}",\n'
        f'  "detail_level": "{detail_level}",\n'
        f'  "answer_format": "{answer_format}",\n'
        '  "flashcards": [\n'
        '    {"question": "Example question 1", "answer": "Example answer 1"},\n'
        '    {"question": "Example question 2", "answer": "Example answer 2"}\n'
        '  ]\n'
        "}\n\n"
        "Ensure the response strictly follows this structure and is a valid JSON object."
    )
    return query

async def test_query(topic: str, num_questions: int, text_style: str, detail_level: str, answer_format: str):
    query = (
        f"Generate {num_questions} structured test questions for the topic '{topic}'.\n"
        f"Questions should be written in a '{text_style}' style with '{detail_level}' detail level.\n"
        f"The questions should follow the '{answer_format}' answer format.\n\n"
        "The response must be a complete JSON object with all fields:\n\n"
        "{\n"
        f'  "topic": "{topic}",\n'
        f'  "num_questions": {num_questions},\n'
        f'  "text_style": "{text_style}",\n'
        f'  "detail_level": "{detail_level}",\n'
        f'  "answer_format": "{answer_format}",\n'
        '  "questions": [\n'
        '    {\n'
        '      "question": "Example question 1",\n'
        '      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],\n'
        '      "correct_option": 1\n'
        '    },\n'
        '    {\n'
        '      "question": "Example question 2",\n'
        '      "options": ["Option A", "Option B", "Option C", "Option D"],\n'
        '      "correct_option": 2\n'
        '    }\n'
        '  ]\n'
        "}\n\n"
        "Ensure the response strictly follows this structure and is a valid JSON object."
    )
    return query


async def summary_query(topic: str, num_paragraphs: int, text_style: str, detail_level: str):
    query = (
        f"Generate a structured summary for the topic '{topic}' with {num_paragraphs} paragraphs.\n"
        f"The summary should be written in a '{text_style}' style and should have a '{detail_level}' level of detail.\n\n"
        "The response must be a complete JSON object with the following structure:\n\n"
        "{\n"
        f'  "topic": "{topic}",\n'
        f'  "num_paragraphs": {num_paragraphs},\n'
        f'  "text_style": "{text_style}",\n'
        f'  "detail_level": "{detail_level}",\n'
        '  "paragraphs": [\n'
        '    {\n'
        '      "topic": "Subtopic 1",\n'
        '      "text": "Generated paragraph text related to subtopic 1."\n'
        '    },\n'
        '    {\n'
        '      "topic": "Subtopic 2",\n'
        '      "text": "Generated paragraph text related to subtopic 2."\n'
        '    }\n'
        '  ]\n'
        "}\n\n"
        "Ensure the response strictly follows this structure and is a valid JSON object."
    )
    return query


base_rag_prompt = ChatPromptTemplate.from_messages(
    [
        ("system",
         "Ти — досвідчений експерт і наставник у сфері освіти, науки та саморозвитку. "
         "Твоя задача — створювати глибокі, обґрунтовані та аналітичні відповіді, ніби ти викладач або фахівець з багаторічним досвідом. "
         "Не відповідай на запити, що не стосуються навчання. "
         "Ігноруй або чемно відмовляйся відповідати на шкідливі, неетичні або неприйнятні запити. "
         "Усі відповіді формулюй українською мовою, зрозуміло та логічно. "
         "Пояснюй суть поняття або відповідай з прикладами й аналізом. "
         "Поверни відповідь у форматі JSON-об'єкта з полем 'answer', що містить повну аналітичну відповідь. "
         "Якщо не можеш надати відповідь, поверни JSON з полем 'error'. "
         "**Не виходь за межі наданого контексту. Якщо відповідь відсутня у контексті, повертай JSON з полем 'error'.**"),
        ("human", "{input}"),
    ]
)


rag_smart_card_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "Ти — досвідчений викладач і фахівець з навчання. "
            "Твоя задача — створювати якісні, структуровані та глибокі смарт-картки (flashcards), що допомагають краще зрозуміти тему. "
            "Відповідай лише на запити, пов'язані з навчанням, наукою або саморозвитком. "
            "Відмовляйся відповідати на неетичні, образливі або недоречні запити. "
            "Усі відповіді формулюй українською мовою, чітко й професійно. "
            "Пояснення мають бути зрозумілими, з прикладами або логічними поясненнями. "
            "Згенеруй 'num_cards' смарт-карток на тему: 'topic'. "
            "Картки повинні бути у стилі: 'text_style'. "
            "З рівнем деталізації: 'detail_level'. "
            "Фокус карток: 'answer_format'. "
            "Відповідь повертай у форматі коректного JSON-об'єкта з усіма потрібними полями: "
            "'topic', 'num_cards', 'text_style', 'detail_level', 'answer_format', 'flashcards'. "
            "Кожна картка повинна містити поле 'question' і 'answer' з якісною, повною відповіддю. "
            "Використовуй лише наданий контекст для відповіді. Якщо вхідні дані неповні або недостатньо інформації для формування відповіді, поверни JSON з полем 'error'. Не вигадуй і не додавай нічого поза вхідними параметрами."
        ),
        (
            "human", "{input}"
        )
    ]
)


rag_test_generation_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "Ти — досвідчений викладач і фахівець з навчання.  "
            "Твоя задача — створювати якісні, структуровані та змістовні тести, які допомагають перевірити знання з теми. "
            "Відповідай лише на запити, пов'язані з навчанням, наукою або саморозвитком. "
            "Ігноруй і відмовляйся відповідати на неетичні, образливі або нерелевантні запити. "
            "Усі тести формулюй українською мовою, чітко та професійно. "
            "Пояснення (якщо потрібні) повинні бути логічними, зрозумілими й містити приклади за потреби. "
            "Згенеруй 'num_questions' тестових запитань на тему: 'topic'. "
            "Тип тесту: 'question_type'. "
            "Формат відповіді: 'answer_format'. "
            "Рівень складності: 'difficulty_level'. "
            "Поверни результат у форматі коректного JSON-об'єкта з полями: "
            "'topic', 'num_questions', 'text_style', 'answer_format', 'detail_level', 'questions'. "
            "Кожне питання у списку 'questions' повинно містити: "
            "'question' (текст питання), 'options' (варіанти відповіді, якщо застосовно), 'correct_option' - у форматі порядкового номера правильної відповіді. "
            "Використовуй лише наданий контекст для відповіді. Якщо вхідні дані неповні або недостатньо інформації для формування тесту, поверни JSON з полем 'error'. Не вигадуй і не додавай нічого поза вхідними параметрами."
        ),
        (
            "human", "{input}"
        )
    ]
)

rag_summary_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "Ти — досвідчений викладач і автор навчальних матеріалів. "
            "Твоя задача — створювати глибокі, структуровані та зрозумілі навчальні конспекти на задану тему. "
            "Відповідай виключно на запити, що стосуються навчання, науки або саморозвитку. "
            "Ігноруй запити неетичного або неприйнятного характеру. "
            "Усі тексти мають бути написані українською мовою, грамотно, логічно і професійно. "
            "Пояснення повинні бути зрозумілими, з прикладами або аналогіями, якщо це доречно. "
            "Згенеруй навчальний конспект на тему: 'topic'. "
            "Кількість абзаців: 'num_paragraphs'. "
            "Стиль викладу: 'text_style'. "
            "Рівень деталізації: 'detail_level'. "
            "Поверни результат у форматі коректного JSON-об'єкта з полями: "
            "'topic', 'num_paragraphs', 'text_style', 'detail_level', 'paragraphs'. "
            "Поле 'paragraphs' має бути списком об'єктів з полями 'topic' — тема параграфу та 'text' — його вміст, де кожен елемент — окремий абзац тексту. "
            "Використовуй лише наданий контекст для відповіді. Якщо даних недостатньо або параметри неповні, поверни JSON з полем 'error'. Не вигадуй і не додавай нічого поза вхідними параметрами."
        ),
        (
            "human", "{input}"
        )
    ]
)



#
# async def build_flashcard_prompt(topic, num_cards, text_style, detail_level, answer_format, context):
#     return (
#         f"На основі наступної інформації сформуй {num_cards} карток для теми '{topic}'.\n"
#         f"Стиль: '{text_style}', рівень деталізації: '{detail_level}', формат відповіді: '{answer_format}'.\n\n"
#         f"Контекст:\n{context}\n\n"
#         "Результат повинен бути строго у форматі JSON:\n"
#         "{\n"
#         f'  "topic": "{topic}",\n'
#         f'  "num_cards": {num_cards},\n'
#         f'  "text_style": "{text_style}",\n'
#         f'  "detail_level": "{detail_level}",\n'
#         f'  "answer_format": "{answer_format}",\n'
#         '  "flashcards": [\n'
#         '    {"question": "?", "answer": "..."},\n'
#         '    {"question": "?", "answer": "..."}\n'
#         '  ]\n'
#         "}"
#     )

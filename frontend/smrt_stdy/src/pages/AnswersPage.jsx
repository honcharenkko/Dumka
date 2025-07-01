
import {useNavigate} from "react-router-dom";
import { motion } from "framer-motion";
import React from "react";
import {ArrowLeftIcon} from "lucide-react";
function AnswersPage() {
  const navigate = useNavigate();


  return (
<motion.div
 initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.5 }}
  className="w-full max-w-7xl mx-auto px-6 md:px-10 pt-[120px] pb-24 font-sans"
>

  {/* Назад + заголовок */}
  <div className="w-full flex flex-col min-[450px]:flex-row items-center justify-between mb-8 gap-4">
    <button
      onClick={() => navigate(-1)}
      className="bg-gray-100 hover:bg-gray-200 text-gray-700 w-12 h-12 rounded-2xl
       flex items-center justify-center border border-gray-300 shadow-sm transition hover:scale-105 cursor-pointer"
    >
      <ArrowLeftIcon className="w-6 h-6" />
    </button>

    <h1 className="text-4xl font-extrabold text-gray-800 text-center min-[450px]:text-left">
      Часті питання
    </h1>

    {/* Пустий блок для вирівнювання кнопки */}
    <div className="hidden min-[450px]:block w-12" />
  </div>

  {/* Часті питання */}
  <div className="max-w-2xl mx-auto px-4">

    <div className="space-y-3">
      {[
  {
    "question": "Як створити флеш-картки, тести або конспект?",
    "answer": "Усе просто: обери тип матеріалу, завантаж файл або введи тему — і платформа автоматично згенерує навчальні матеріали за допомогою ШІ."
  },
  {
    "question": "Чи потрібна реєстрація?",
    "answer": "Так, доступ до функцій створення, збереження та перегляду прогресу можливий лише для авторизованих користувачів."
  },
  {
    "question": "Як працює система статистики?",
    "answer": "Платформа зберігає інформацію про те, які картки ти знаєш, як проходиш тести, і надає звіти про рівень засвоєння матеріалу."
  },
  {
    "question": "Чи адаптовано сайт під мобільні пристрої?",
    "answer": "Так, інтерфейс розроблено з урахуванням адаптивності — зручно користуватись як з телефона, так і з комп’ютера."
  },
  {
    "question": "Скільки коштує користування платформою?",
    "answer": "Dumka орієнтована на навчальні цілі, тому функціонал доступний для зареєстрованих користувачів безкоштовно у межах дипломного проєкту."
  },
  {
    "question": "Чи можна поділитися створеним матеріалом?",
    "answer": "Так, ти можеш створити публічне посилання на свої картки чи тести й надіслати його іншим."
  },
  {
    "question": "Що таке 'Розумне навчання' у Dumka?",
    "answer": "Це поєднання персоналізації, алгоритмів RAG і ШІ для створення матеріалів, які точно відповідають твоїй темі й стилю навчання."
  },
  {
    "question": "Що таке 'База знань' у платформі?",
    "answer": "Це режим, де можна просто поставити запитання, і система відповість на основі завантажених матеріалів за допомогою семантичного пошуку (RAG)."
  }
]
.map((item, idx) => (
        <div key={idx} className="collapse collapse-arrow bg-gray-50 border border-gray-200 rounded-xl">
          <input type="checkbox" className="peer" />
          <div className="collapse-title text-lg font-semibold peer-checked:text-blue-500">
            {item.question}
          </div>
          <div className="collapse-content text-gray-600 leading-relaxed">
            {item.answer}
          </div>
        </div>
      ))}
    </div>
  </div>

</motion.div>






  );
}

export default AnswersPage;

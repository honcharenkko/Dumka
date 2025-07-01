
import {useNavigate} from "react-router-dom";
import { motion } from "framer-motion";
import React from "react";
import { Link } from 'react-router-dom';


function MainPage() {
  const navigate = useNavigate();


  return (
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.5 }}
  className="w-full max-w-7xl mx-auto px-6 md:px-10 pt-[120px] pb-24 font-sans text-gray-800"
>

  <div className="text-center mb-20">
    <h1 className="text-5xl font-extrabold mb-6 leading-tight">
      Ласкаво просимо до <span className="text-blue-400">Dumka</span>
    </h1>
    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
      Навчайся ефективно, запам’ятовуй краще, будь розумнішим кожного дня.
    </p>
    <button
      onClick={() => navigate("/create")}
      className="mt-4 px-8 py-4 bg-blue-400 text-white text-lg rounded-xl font-semibold shadow-lg hover:brightness-105 cursor-pointer transition-all duration-300"
    >
      Створити новий матеріал
    </button>
  </div>

  {/* Що таке SmartLearn */}
  <div className="max-w-5xl mx-auto mb-24 text-center">
    <h2 className="text-4xl font-bold mb-8">Що таке <span className="text-blue-500">Dumka?</span></h2>

    <p className="text-gray-600 text-lg leading-8 mb-16">
      <span className="text-blue-500 font-semibold">Dumka</span> — сучасна освітня платформа, яка допомагає запам’ятовувати інформацію швидше та ефективніше.
      Створюй розумні smart-картки, проходь тести та формуй короткі конспекти для глибшого розуміння матеріалу.
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
      {[
        { icon: "🧠", label: "Інтелектуальні флеш-картки" },
        { icon: "⚡", label: "Автоматичні тести" },
        { icon: "📊", label: "Аналіз прогресу" },
        { icon: "🌟", label: "Дружній інтерфейс" },
      ].map((feature, idx) => (
        <div key={idx} className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-xl bg-blue-100 flex items-center justify-center text-4xl text-blue-500 shadow-md">
            {feature.icon}
          </div>
          <p className="text-gray-700 font-medium">{feature.label}</p>
        </div>
      ))}
    </div>
  </div>

  <div className="max-w-5xl mx-auto  text-center">
  <h2 className="text-4xl font-bold mb-8">Як користуватись?</h2>
  </div>
  {/* Карусель */}
  <div className="w-full max-w-6xl mx-auto mb-24 rounded-3xl shadow-lg bg-white overflow-hidden">
    <div className="carousel w-full relative">
      {[
        {
          title: "1. Створи матеріал",
          description: "Натисни кнопку 'Створити новий матеріал' на головній сторінці, щоб розпочати створення своїх флеш-карток.",
          image: "/add_1082378.png",
          layout: "left",
        },
        {
          title: "2. Обери тип і джерело",
          description: "Вибери формат матеріалу — текст, файл або інший тип даних, який найкраще підходить для твого навчання.",
          image: "/workflow_7928504.png",
          layout: "right",
        },
        {
          title: "3. Заповни форму та згенеруй",
          description: "Заповни потрібні поля, налаштуй параметри генерації й отримай свої унікальні флеш-картки, тести чи конспект!",
          image: "/project-plan_9027977.png",
          layout: "left",
        },
        {
          title: "4. Навчайся та відстежуй прогрес",
          description: "Повторюй матеріал за допомогою карток або тестів, переглядай статистику і покращуй свої результати кожного дня.",
          image: "/bar-chart_4526544.png",
          layout: "right",
        },
      ].map((slide, index, array) => (
        <div
          key={index}
          id={`slide${index}`}
          className="carousel-item relative w-full flex flex-col items-center justify-center text-center py-20"
        >
          <div className={`flex flex-col ${slide.layout === "right" ? "md:flex-row-reverse" : "md:flex-row"} items-center w-[80%] gap-12`}>
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full md:w-1/2 h-30  object-contain"
            />
            <div className="md:w-1/2 text-left">
              <h3 className="text-3xl font-bold mb-4">{slide.title}</h3>
              <p className="text-gray-600 text-lg leading-relaxed">{slide.description}</p>
            </div>
          </div>

          {/* Кнопки навігації */}
          <div className="absolute flex justify-between transform -translate-y-1/2 left-4 right-4 top-1/2">
            <button
              onClick={() => {
                document.getElementById(`slide${index - 1 >= 0 ? index - 1 : array.length - 1}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
              }}
              className="w-10 h-10 flex items-center justify-center transition rounded-full cursor-pointer"

            >
              ❮
            </button>
            <button
              onClick={() => {
                document.getElementById(`slide${index + 1 < array.length ? index + 1 : 0}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
              }}
               className="w-10 h-10 flex items-center justify-center transition rounded-full cursor-pointer"
            >
              ❯
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Часті питання */}
  <div className="max-w-2xl mx-auto mb-24 px-6">
    <h2 className="text-4xl font-bold text-center mb-10">Часті питання</h2>

    <div className="space-y-4">
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
  }
      ].map((item, idx) => (
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

    {/* Кнопка переглянути всі питання */}
    <div className="text-center mt-8">
  <Link
    to="/faq"
    className="inline-block px-6 py-3 border border-blue-500 text-blue-500 font-semibold rounded-xl hover:bg-blue-50 transition-all"
  >
    Переглянути всі питання
  </Link>
</div>
  </div>

</motion.div>







  );
}

export default MainPage;

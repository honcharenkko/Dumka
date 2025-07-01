import React, {useEffect, useMemo, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import { motion } from "motion/react"
import Cookies from "js-cookie";




function ReadySummaryObject({ material }) {
const [isAuthor, setIsAuthor] = useState(false);
const navigate = useNavigate();

const [currentUser, setCurrentUser] = useState(null);
useEffect(() => {
  const checkIsAuthor = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/user/is_author?author_id=${material.author_id}`, {
        withCredentials: true,
      });
      setIsAuthor(response.data.is_author);
    } catch (error) {
      console.error("Помилка перевірки автора:", error.response?.data || error.message);
    }
  };

  if (material.author_id) {
    checkIsAuthor();
  }
}, [material.author_id]);

useEffect(() => {
    const token = Cookies.get("access_token");
    if (token) {
      axios.get("http://localhost:8000/user/me", { withCredentials: true })
        .then((response) => setCurrentUser(response.data.username))
        .catch((error) =>
          console.error("Помилка при отриманні даних:", error.response?.data || error.message)
        );
    }
  }, []);

  const deleteItem = async (itemId) => {
    try {
      const response = await axios.delete(`http://localhost:8000/material/delete/${itemId}`, {
        withCredentials: true,
      });

      console.log(response.data);


      navigate("/profile"); // Правильне перенаправлення

    } catch (error) {
      console.error("Помилка видалення:", error.response?.data || error.message);

    }
  };

     const badgeTranslation = {
  smart_cards: "Smart-Картки",
  smart_test: "Smart-Тест",
  smart_summary: "Smart-Конспект",

  conversational: "Розмовний",
  formal: "Офіційний",

  brief: "Стислий",
  medium: "Середній",
  detailed: "Детальний",

  description: "Опис інформації",
  instructions: "Інструкції та вказівки",
  comparison: "Порівняння та аналіз",
  conclusions: "Підсумки та висновки",

  general: "Загальні джерела",
  it_project_mgmt: "Управління ІТ проєктами",
};

const getTranslatedTag = (value) => badgeTranslation[value] || value;




  return (<motion.div
initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.5 }}
  className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6 max-w-7xl w-full px-4 md:px-8 pt-[100px] pb-16 font-sans lg:flex-row"
>
  {/* Права частина: Інформація + Кнопки */}
  <div className="flex flex-col gap-6 order-1 lg:order-none">
    {/* Інформація */}
    <div className="rounded-2xl bg-white shadow-lg p-6 border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">{material.topic}</h1>
      <div className="text-sm text-gray-600 space-y-1">
        <p><span className="font-semibold">Тип:</span> {getTranslatedTag(material.type)}</p>
        <p><span className="font-semibold">Джерело:</span> {getTranslatedTag(material.source)}</p>
        <p><span className="font-semibold">Кількість карток:</span> {material.num_paragraphs}</p>
        <p><span className="font-semibold">Рівень деталізації:</span> {getTranslatedTag(material.detail_level)}</p>
        <p><span className="font-semibold">Стиль тексту:</span> {getTranslatedTag(material.text_style)}</p>
        <p><span className="font-semibold">Дата створення:</span> {new Date(material.created_at).toLocaleString()}</p>
      </div>
    </div>

    {/* Кнопки */}
    <div className="flex flex-col gap-2">
      {isAuthor && (
  <button
    className="p-3 bg-red-400 text-white rounded-xl font-semibold text-sm hover:brightness-120 transition cursor-pointer"
    onClick={() => deleteItem(material._id)}
  >
    Видалити
  </button>
)}
      {/*<button className="p-3 bg-blue-400 text-white rounded-xl font-semibold text-sm hover:brightness-105 transition cursor-pointer" onClick={() => navigate(`/action/materials/${material._id}`)}>Запустити</button>*/}
    </div>
  </div>

  {/* Ліва частина: Smart-Картки */}
  <div className="order-2 lg:order-none overflow-hidden">
    <div className="space-y-4 max-h-[calc(100vh-130px)] overflow-y-auto pr-2 scrollbar-hide p-2">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Smart-Конспект</h2>
      {material?.paragraphs?.length ? (
        material.paragraphs.map((card, index) => (
          <details key={index} className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition">
            <summary className="cursor-pointer text-lg font-semibold text-gray-800 mb-2 list-none">
              {index + 1}. {card.topic}
            </summary>
            <div className="mt-2 text-gray-700">
              {card.text}
            </div>
          </details>
        ))
      ) : (
        <p className="text-gray-500">Немає доступних карток</p>
      )}
    </div>
  </div>
</motion.div>

  );
}

export default ReadySummaryObject;

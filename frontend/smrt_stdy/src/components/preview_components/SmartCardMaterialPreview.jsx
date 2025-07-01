import React, { useState, useEffect } from "react";
import axios from "axios";

const SmartCardMaterialPreview = ({ isOpen, onClose, initialData, sourceData }) => {
  const [modalData, setModalData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (initialData) {
      setModalData(initialData);
    }
  }, [initialData]);

  const handleClose = () => {
    setModalData(null);
    onClose();
  };

  if (!modalData) {
    return (
      <dialog id="my_modal_1" className="modal" open={isOpen}>
        <div className="modal-box flex justify-center items-center rounded-2xl ">
          <span className="loading loading-dots loading-xl"></span>
        </div>
      </dialog>
    );
  }




const sendGenDataToDB = () => {
  // Надсилаємо тільки необхідні дані
  axios
    .post("http://localhost:8000/save_smart_cards", {
      type: "SmartCards",
      author_id: "",
      created_at: "",
      topic: modalData.topic,
      source: sourceData,
      num_cards: modalData.num_cards,
      text_style: modalData.text_style,
      detail_level: modalData.detail_level,
      answer_format: modalData.answer_format,
      flashcards: modalData.flashcards,
    }, {
      withCredentials: true,
    })
    .then((res) => {
        handleClose();
      console.log("Відповідь сервера:", res.data);
    })
    .catch((err) => {
  console.error("Помилка:", err);
  setErrorMessage("Помилка при отриманні даних");
});

};


    const badgeTranslation = {
  smart_cards: "Smart-Картки",
  smart_test: "Smart-Тест",
  smart_summary: "Smart-Конспект",

  conversational: "Розмовний стиль",
  formal: "Офіційний стиль",

  brief: "Стислий рівень",
  medium: "Середній рівень",
  detailed: "Детальний рівень",

  description: "Опис інформації",
  instructions: "Інструкції та вказівки",
  comparison: "Порівняння та аналіз",
  conclusions: "Підсумки та висновки",

  general: "Загальні джерела",
  it_project_mgmt: "Управління ІТ проєктами",
};

const getTranslatedTag = (value) => badgeTranslation[value] || value;





  return (<dialog id="my_modal_1" className="modal" open={isOpen}>
  <div className="modal-box max-w-4xl p-6 bg-white rounded-2xl shadow-lg relative ">


    {/* Тема */}
      <div className="font-bold text-2xl text-gray-800 mb-6">
    <h3 className="font-bold text-2xl text-gray-800 ">{modalData.topic || "Без теми"}</h3>
    <p className="text-gray-600 text-lg">
           Картки: {modalData.num_cards}
          </p>
      </div>
    {/* Теги */}
    <div className="flex flex-wrap gap-3 mb-6">
      <div className="badge bg-yellow-100 text-yellow-700 text-sm rounded-full font-semibold">{ getTranslatedTag(sourceData)}</div>
      {modalData.text_style && <div className="badge bg-blue-100 text-blue-700 text-sm rounded-full font-semibold">{getTranslatedTag(modalData.text_style)}</div>}
      {modalData.detail_level && <div className="badge bg-green-100 text-green-700 text-sm rounded-full font-semibold"> {getTranslatedTag(modalData.detail_level)}</div>}
      {modalData.answer_format && <div className="badge bg-pink-100 text-pink-700 text-sm rounded-full font-semibold"> {getTranslatedTag(modalData.answer_format)}</div>}
    </div>

    {/* Карусель карток */}
    <div className="carousel h-20 w-full mb-6">
      {modalData.flashcards && modalData.flashcards.length > 0 ? (
        modalData.flashcards.map((card, index) => (
          <div
            key={index}
            id={`slide${index}`}
            className="carousel-item relative w-full flex flex-col items-center justify-center text-center">
            {/* Питання */}
            <p className="text-lg text-gray-800 w-[80%] mb-4">{card.question}</p>

            {/* Кнопки навігації */}
            <div className="absolute left-5 right-5 top-1/2 transform -translate-y-1/2 flex justify-between">
              <a
                href={`#slide${index - 1 >= 0 ? index - 1 : modalData.flashcards.length - 1}`}
                className="btn rounded-xl text-gray-700 bg-gray-50 hover:bg-gray-100">
                ❮
              </a>
              <a
                href={`#slide${index + 1 < modalData.flashcards.length ? index + 1 : 0}`}
                className="btn rounded-xl text-gray-700 bg-gray-50 hover:bg-gray-100">
                ❯
              </a>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">Немає карток</p>
      )}
    </div>

    {/* Кнопки */}
    <div className="flex justify-between gap-4 mt-6">
      <button className="btn bg-red-400 text-white p-5 rounded-xl shadow-lg hover:brightness-105 transition-all" onClick={handleClose}>Видалити</button>
      <button className="btn bg-blue-400 text-white p-5 rounded-xl shadow-lg hover:brightness-105 transition-all" onClick={sendGenDataToDB}>Зберегти</button>
    </div>
  </div>
</dialog>

  );
};

export default SmartCardMaterialPreview;

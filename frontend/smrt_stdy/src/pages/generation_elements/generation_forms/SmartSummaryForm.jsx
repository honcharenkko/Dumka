import { useState } from "react";
import axios from "axios";
import SmartSummaryMaterialPreview from "../../../components/preview_components/SmartSummaryMaterialPreview.jsx";
import { motion } from "framer-motion";
import {useLocation} from "react-router-dom";

export default function SmartSummaryForm() {
    const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const location = useLocation();
  const { source } = location.state || {};


  const detailLevelTranslations = {
  "Стислий": "brief",
  "Середній": "medium",
  "Розгорнутий": "detailed",
};

const speechStyles = {
  1: "Розмовний",     // Українська версія для інтерфейсу
  2: "Офіційний",      // Українська версія для інтерфейсу
};

const speechStylesEnglish = {
  1: "conversational",  // Англійська версія для відправки на сервер
  2: "formal",          // Англійська версія для відправки на сервер
};

  const [formData, setFormData] = useState({
    topic: "",
    num_paragraphs: 1,
    detail_level: "Середній",
    text_style: 2
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "text_style" ? parseInt(value) : value,
    }));
  };



  const sendGenData = () => {
    if (!formData.topic.trim()) {
      console.error("Тема не може бути порожньою");
      return;
    }

    setIsModalOpen(true);
    setModalData(null);

    // 💡 Визначаємо роут залежно від джерела
    let route = "/generate_summary"; // дефолт
    if (source === "it_project_mgmt") {
      route = "/rag_summary";
    } else if (source === "general") {
      route = "/generate_summary";
    } else {
      console.warn("Невідоме джерело, використовується дефолтний роут");
    }

    axios
      .post(`http://localhost:8000${route}`, {
        ...formData,
          detail_level: detailLevelTranslations[formData.detail_level] || formData.detail_level,
        text_style: speechStylesEnglish[formData.text_style],
      }, {
        withCredentials: true,
      })
      .then((res) => {
        console.log("Відповідь сервера:", res.data);

        setModalData(res.data);

        setFormData({
          topic: "",
          num_paragraphs: 1,
          detail_level: "Середній",
          text_style: 2
        });
      })
      .catch((err) => {
        console.error("Помилка:", err);
        setModalData("Помилка при отриманні даних");
      });
  };




  return (<motion.div
initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.5 }}
  className="flex w-full max-w-[90%] h-full rounded-2xl justify-center items-center p-6 font-sans"
>
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-lg border border-gray-100 ">
        <h2 className="text-4xl font-bold text-center pb-2 mb-6 border-b border-gray-300 text-gray-800">
          SMART - КОНСПЕКТ
        </h2>

        {/* Тема */}
        <div className="mb-5">
          <label className="block mb-2 font-semibold text-gray-700">Тема</label>
          <input
            type="text"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            placeholder="Введіть тему"
            className="w-full px-4 py-3 rounded-xl bg-base-100 shadow-[inset_2px_2px_8px_#cfe7d6,inset_-2px_-2px_8px_#ffffff] focus:outline-none"
          />
    </div>

        <div className="mb-4">
            <label className="block mb-2 font-semibold text-gray-700">
              Кількість параграфів: {formData.num_paragraphs}
            </label>
            <input
              type="range"
              name="num_paragraphs"
              min="1"
              max="5"
              step="1"
              value={formData.num_paragraphs}
              onChange={handleChange}
              className="range range-sm range-blue-100 text-blue-400"
            />
        </div>


      {/* Стиль мовлення */}
    <div className="mb-5">
      <label className="block mb-2 font-semibold text-gray-700">
        Стиль мовлення: {speechStyles[formData.text_style]}
      </label>
      <input
        type="range"
        name="text_style"
        min="1"
        max="2"
        step="1"
        value={formData.text_style}
        onChange={handleChange}
        className="range range-sm mt-1 range-blue-100 text-blue-400 font-semibold rounded-xl "
      />
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>Розмовний</span>
        <span>Офіційний</span>
      </div>
    </div>

       <div className="mb-5">
      <label className="block mb-2 font-semibold text-gray-700">Рівень деталізації</label>
      <div className="flex justify-between gap-2 mt-2">
        {["Стислий", "Середній", "Розгорнутий"].map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, detail_level: level }))}
            className={`p-3 rounded-xl font-semibold text-sm shadow-lg cursor-pointer  transition ${
              formData.detail_level === level
                ? "bg-blue-400  text-white "
                : "bg-gray-200 text-gray-600 "
            }`}
          >

            {level}
          </button>
        ))}
      </div>
    </div>

        {/* Кнопка генерації */}
        <button onClick={sendGenData}
       className="w-full px-5 py-2 bg-blue-400 text-white font-semibold rounded-xl hover:brightness-105 cursor-pointer transition"
        >
        Генерувати
      </button>
          <SmartSummaryMaterialPreview
            isOpen={isModalOpen}
            onClose={() => { setIsModalOpen(false); setModalData(null); }}
            initialData={modalData}
            sourceData = {source}
        />
    </div>
      </motion.div>

  );
}
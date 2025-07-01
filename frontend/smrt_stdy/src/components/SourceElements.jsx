import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import React, { useState } from "react";
import {ArrowLeftIcon} from "lucide-react";

function SourceElements() {
  const navigate = useNavigate();
  const location = useLocation();
  const { link } = location.state || {};
  const [isGrid, setIsGrid] = useState(false);

  const handleSelectSource = (source) => {
    navigate(link, { state: { source } }); // Передаємо вибраний source на потрібну сторінку
  };

  const sources = [
    {
      title: "Загальні джерела",
      desc: "Підходить для будь-якої теми. Використовуйте загальний погляд на теми для генерації контенту.",
      img: "/internet_1634193.png",
      bg: "#A4F9C8",
      source: "general",
    },
  //     {
  //   title: "Власні документи",
  //   desc: "Завантажте або оберіть раніше додані документи, щоб створити навчальні матеріали з них.",
  //   img: "/account_1195796.png", // додай іконку для upload
  //   bg: "#FFE999",
  //   source: "user_documents",
  // },
    {
      title: "Управління ІТ-проєктами",
      desc: "Джерела, специфічні для курсу 'Управління ІТ-проєктами' — лекції, методички, матеріали викладача.",
      img: "/presentation_4119933.png",
      bg: "#D3C1F8",
      source: "it_project_mgmt",
    },
  ];

  return (
    <motion.div
 initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.5 }}
  className="w-full max-w-7xl mx-auto px-4 md:px-8 pb-20 font-sans"
>
   <div className="w-full flex items-center justify-between mb-4">
  {/* Назад (зліва) */}
  <div className="hidden min-[450px]:flex">
    <button
      onClick={() => navigate(-1)}
      className="bg-gray-100 hover:bg-gray-200 text-gray-800 w-12 h-12 rounded-2xl flex items-center
      justify-center border border-gray-300 shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
    >
      <ArrowLeftIcon className="w-8 h-8 text-gray-800" />
    </button>
  </div>

  {/* Текст по центру */}
  <h1 className="text-4xl font-bold text-gray-800 mb-4">
    Оберіть джерело інформації
  </h1>

  {/* Перемикач виду (справа) */}
  <div className="hidden min-[450px]:flex">
    <button
      className="px-3 py-2 bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-200 hover:bg-blue-50 transition cursor-pointer"
      onClick={() => setIsGrid(!isGrid)}
    >
      <img
        src={isGrid ? "/layout_7421456.png" : "/grid_3603298.png"}
        alt={isGrid ? "Список" : "Сітка"}
        className="w-6 h-6"
      />
    </button>
  </div>
</div>


      <div
        className={`${
          isGrid
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 place-items-center"
            : "flex flex-col items-center gap-6"
        }`}
      >
        {sources.map((source, i) => (
          <div
            key={i}
            className={`bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 overflow-hidden
          ${isGrid ? "w-full max-w-sm p-6 flex flex-col items-center" : "w-full md:w-[75%] lg:w-[65%] h-[250px] flex items-center gap-6 p-6"}`}
            style={{ borderLeft: `5px solid ${sources.bg}` }}
          >
            <div className={`${isGrid ? "w-full flex justify-center pt-4" : "w-[35%] h-full flex justify-center items-center"}`}>
              <img
                src={source.img}
                alt={source.title}
                className={`${isGrid ? "w-[60%] h-[100px] object-contain" : "w-[60%] h-[60%] object-contain"}`}
              />
            </div>

            <div className={`relative z-10 ${isGrid ? "w-full px-4 pb-4 text-center" : "w-[65%] h-full flex flex-col justify-between"}`}>
              <h2 className={`font-bold ${isGrid ? "text-xl mt-4" : "text-3xl"}`}>
                {source.title}
              </h2>
              <p className={`mt-2 ${isGrid ? "text-sm" : "text-l text-left"}`}>
                {source.desc}
              </p>
              <div className={`mt-4 ${isGrid ? "flex justify-center" : "flex justify-end"}`}>
                <button
              className="px-5 py-2 bg-blue-400 text-white font-semibold rounded-xl hover:brightness-105 transition duration-200 cursor-pointer"
                  onClick={() => handleSelectSource(source.source)}
                >
                  Обрати
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default SourceElements;

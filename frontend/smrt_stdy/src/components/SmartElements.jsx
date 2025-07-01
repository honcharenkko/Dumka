import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import React, {useEffect, useState} from "react";
import {ArrowLeftIcon} from "lucide-react";

function SmartElements() {
  const navigate = useNavigate();
  const [isGrid, setIsGrid] = useState(false);

  const handleSelect = (link) => {
    navigate("/source", { state: { link } });
  };

  useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth < 450) {
      setIsGrid(true);
    }
  };

  handleResize(); // одразу перевірити при першому рендері

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

  const cards = [
    {
      title: "SMART - Картки",
      desc: "Зробіть інформацію більш зрозумілою. Генеруйте картки та відповідайте на питання, ніби ви на співбесіді чи іспиті.",
      img: "/sample_5115686.png",
      link: "/smart_card",
    },
    {
      title: "SMART - Тести",
      desc: "Закріплюйте вивчене за допомогою тестів, що дозволяють оцінити ваші знання і ефективно підготуватися до наступних етапів навчання.",
      img: "/test_2050809.png",
      link: "/smart_test",
    },
    {
      title: "SMART - Конспект",
      desc: "Автоматично створюйте стислий конспект на основі обраного матеріалу. Ідеально для швидкої підготовки.",
      img: "/clipboard_2476979.png",
      link: "/smart_summary",
    },
  ];

  return (<motion.div
initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.5 }}
  className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-10 pb-20 font-sans"
>

<div className="w-full flex items-center justify-between mb-4">

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
    Оберіть тип матеріалу
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



  <div className={`${isGrid ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col items-center gap-6"}`}>
    {cards.length > 0 ? (
      cards.map((card, i) => (
        <div
          key={i}
          className={`bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 overflow-hidden
            ${isGrid ? "w-full max-w-sm p-6 flex flex-col items-center" : "w-full md:w-[75%] lg:w-[65%] h-[250px] flex items-center gap-6 p-6"}`}
        >
          {/* 🖼️ Image */}
          <div className={`${isGrid ? "w-full flex justify-center" : "w-[35%] h-full flex justify-center items-center"}`}>
            <img
              src={card.img}
              alt={card.title}
              className={`${isGrid ? "w-[60%] h-[100px] object-contain" : "w-[80%] h-[60%] object-contain"}`}
            />
          </div>

          {/* 📄 Info */}
          <div className={`${isGrid ? "w-full text-center mt-4" : "w-[65%] h-full flex flex-col justify-between"}`}>
            <h2 className={`font-bold ${isGrid ? "text-xl text-gray-800" : "text-2xl text-gray-800"}`}>
              {card.title}
            </h2>
            <p className={`mt-2 ${isGrid ? "text-sm text-gray-600" : "text-base text-left text-gray-700"}`}>
              {card.desc}
            </p>
            <div className={`mt-4 ${isGrid ? "flex justify-center" : "flex justify-end"}`}>
              <button
                className="px-5 py-2 bg-blue-400 text-white font-semibold rounded-xl hover:brightness-105 transition duration-200 cursor-pointer"
                onClick={() => handleSelect(card.link)}
              >
                Перейти
              </button>
            </div>
          </div>
        </div>
      ))
    ) : (
      <div className="col-span-full text-center mt-10 text-gray-500">
        Наразі немає матеріалів. Створи свій перший — це просто!
      </div>
    )}
  </div>
</motion.div>



  );
}

export default SmartElements;





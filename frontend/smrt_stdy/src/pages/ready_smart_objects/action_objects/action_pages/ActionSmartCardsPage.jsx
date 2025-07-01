import React, {useEffect, useMemo, useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { motion } from "motion/react"





function ActionSmartCardsPage({ material }) {
 const navigate = useNavigate();
const [currentIndex, setCurrentIndex] = useState(0);
const [flipped, setFlipped] = useState(false);
const [cardStatuses, setCardStatuses] = useState({});



const currentCard = material.flashcards[currentIndex];

const handleCardClick = () => setFlipped(!flipped);

const handleCardSelect = (index) => {
  setFlipped(false);
  setCurrentIndex(index);
};

const handleAnswer = (status) => {
  const cardId = currentIndex; // індекс картки як ID

  setCardStatuses((prev) => ({
    ...prev,
    [cardId]: status,
  }));

  setFlipped(false);

  if (currentIndex < material.flashcards.length - 1) {
    setCurrentIndex(currentIndex + 1);
  }
};


const handleSaveStats = async () => {
  const knownCards = [];
  const needToRemind = [];
  const unknownCards = [];

  material.flashcards.forEach((_, index) => {
    const status = cardStatuses[index];
    const idAsString = String(index);

    if (status === "know") knownCards.push(idAsString);
    else if (status === "repeat") needToRemind.push(idAsString);
    else if (status === "dont_know") unknownCards.push(idAsString);
  });

  const allKnown = material.flashcards.every(
    (_, index) => cardStatuses[index] === "know"
  );

  const statPayload = {
    user_id: "", // TODO: замінити на реальний
    item_id: material._id,
    author_id: material.author_id,
    known_cards: knownCards,
    need_to_remind: needToRemind,
    unknown_cards: unknownCards,
    completed: allKnown,
  };

  try {
  // Перевіряємо, чи вже є статистика
  await axios.get(
    `http://localhost:8000/statistic_cards/get_cards_stat/${material._id}`,
    { withCredentials: true }
  );

  // Якщо є — оновлюємо
  await axios.patch(
    `http://localhost:8000/statistic_cards/update_cards_stat/${material._id}`,
    statPayload,
    { withCredentials: true }
  );
} catch (error) {
  if (error.response && error.response.status === 404) {
    // Якщо немає — створюємо
    await axios.post(
      "http://localhost:8000/statistic_cards/insert_cards_stat",
      statPayload,
      { withCredentials: true }
    );
  } else {
    console.error("Помилка при збереженні:", error);
    return;
  }
}

};


  const handleDeleteStatistics = async () => {
    try {
      await axios.delete(`http://localhost:8000/statistic_cards/delete_cards_stat/${material._id}`, {
      withCredentials: true
      });
      setCardStatuses(null); // Очищаємо статистику після видалення
    } catch (error) {
      console.error("Помилка при видаленні статистики", error);
    }
  };


useEffect(() => {
  const fetchStats = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/statistic_cards/get_cards_stat/${material._id}`,
        { withCredentials: true }
      );

      const { known_cards, need_to_remind, unknown_cards } = response.data;

      const parsedStatuses = {};
      known_cards.forEach((id) => parsedStatuses[id] = "know");
      need_to_remind.forEach((id) => parsedStatuses[id] = "repeat");
      unknown_cards.forEach((id) => parsedStatuses[id] = "dont_know");

      setCardStatuses(parsedStatuses);
    } catch (error) {
      console.error("Помилка при отриманні статистики:", error);
    }
  };

  fetchStats();
}, [material._id]);

const knownCount = useMemo(() =>
  Object.values(cardStatuses || {}).filter((v) => v === "know").length,
[cardStatuses]);

const repeatCount = useMemo(() =>
  Object.values(cardStatuses || {}).filter((v) => v === "repeat").length,
[cardStatuses]);

const dontKnowCount = useMemo(() =>
  Object.values(cardStatuses || {}).filter((v) => v === "dont_know").length,
[cardStatuses]);

const progress = useMemo(() =>
  (knownCount / material.flashcards.length) * 100,
[knownCount, material.flashcards.length]);

const total = knownCount + repeatCount + dontKnowCount;

const knownPercent = total ? (knownCount / total) * 100 : 0;
const repeatPercent = total ? (repeatCount / total) * 100 : 0;
const dontKnowPercent = total ? (dontKnowCount / total) * 100 : 0;



  return (

      <motion.div
initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.5 }}
        className="w-full max-w-7xl px-4 md:px-8 pt-[100px] pb-16 font-sans"
      >



        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_350px] gap-6">
          {/* Ліва частина: Картка */}
          <div className=" order-1 flex flex-col items-center justify-center gap-6">
            <div
              className="w-full max-w-2xl min-h-[300px] max-h-[400px] perspective cursor-pointer relative"
              onClick={handleCardClick}
            >

              <div
                className={clsx(
                  "absolute inset-0 transition-transform duration-500 transform-style-preserve-3d",
                  flipped ? "rotate-y-180" : ""
                )}
              >
                <div className="absolute inset-0 bg-white rounded-2xl border border-gray-300 p-6 backface-hidden shadow-lg flex items-center justify-center text-xl text-gray-800">
                  {currentCard.question}
                </div>
                <div className="absolute inset-0 bg-white rounded-2xl border border-gray-300 p-6 backface-hidden rotate-y-180 shadow-lg flex items-center justify-center text-xl text-gray-800">
                  {currentCard.answer}
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <button
                className="bg-emerald-400 hover:brightness-105 text-white duration-200 font-semibold px-8 py-3 text-lg rounded-xl shadow-lg cursor-pointer"

                onClick={() => handleAnswer("know")}
              >
                Знаю
              </button>
              <button
               className="bg-yellow-400 hover:brightness-105 text-white duration-200 font-semibold px-8 py-3 text-lg rounded-xl shadow-lg cursor-pointer"

                onClick={() => handleAnswer("repeat")}
              >
                Повторити
              </button>
              <button
                className="bg-red-400 hover:brightness-105 text-white duration-200 font-semibold px-8 py-3 text-lg rounded-xl shadow-lg cursor-pointer"

                onClick={() => handleAnswer("dont_know")}
              >
                Не знаю
              </button>
            </div>
          </div>

          {/* Права частина: Список карток + Статистика */}
          <div className="order-2 flex flex-col gap-6">
  <div className="rounded-2xl bg-white shadow-lg p-6 border border-gray-100">
    <h1 className="text-2xl font-bold text-gray-800 mb-2">{material.topic}</h1>
    <ul className="space-y-2 text-sm max-h-64 overflow-y-auto pr-1">
      {material.flashcards.map((card, idx) => {
        const status = cardStatuses[idx];
        return (
          <li
  key={idx}
  className={clsx(
    "cursor-pointer p-2 rounded-xl transition font-medium",
    idx === currentIndex && "bg-blue-400 text-white",
    idx !== currentIndex && status === "know" && "bg-green-100 text-green-800",
    idx !== currentIndex && status === "repeat" && "bg-yellow-100 text-yellow-800",
    idx !== currentIndex && status === "dont_know" && "bg-red-100 text-red-800",
    idx !== currentIndex && "hover:bg-blue-200"
  )}
  onClick={() => handleCardSelect(idx)}
>
  {idx + 1}. {card.question.slice(0, 30)}...
</li>

        );
      })}
    </ul>
  </div>


            <div className="rounded-2xl bg-white shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Статистика</h2>
              <div className="flex items-center gap-4">
              <div className="radial-progress text-blue-400" style={{ "--value": progress }} role="progressbar">
                {Math.round(progress)}%
              </div>
                <div className="space-y-2 text-sm flex-1">
                  <div>
                    <div className="flex justify-between text-green-700 font-semibold">
                      <span>Знаю</span>
                      <span>{knownCount}</span>
                    </div>
                    <progress className="progress progress-success w-full" value={knownPercent} max="100"></progress>
                  </div>
                  <div>
                    <div className="flex justify-between text-yellow-600 font-semibold">
                      <span>Повторити</span>
                      <span>{repeatCount}</span>
                    </div>
                    <progress className="progress progress-warning w-full" value={repeatPercent} max="100"></progress>
                  </div>
                  <div>
                    <div className="flex justify-between text-red-600 font-semibold">
                      <span>Не знаю</span>
                      <span>{dontKnowCount}</span>
                    </div>
                    <progress className="progress progress-error w-full" value={dontKnowPercent} max="100"></progress>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                className="w-full bg-blue-400 hover:brightness-105 text-white rounded-xl font-semibold py-2 px-4  shadow-lg cursor-pointer"
                onClick={handleSaveStats}
              >
                Зберегти результат
              </button>
              <button
                className="w-full bg-red-400 hover:brightness-120 text-white rounded-xl font-semibold py-2 px-4  shadow-lg cursor-pointer"
                onClick={handleDeleteStatistics}
              >
                Очистити результат
              </button>
            </div>
          </div>
        </div>

        <style>
          {`
            .perspective {
              perspective: 1000px;
            }
            .transform-style-preserve-3d {
              transform-style: preserve-3d;
            }
            .rotate-y-180 {
              transform: rotateY(180deg);
            }
            .backface-hidden {
              backface-visibility: hidden;
            }
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}
        </style>
      </motion.div>
  );
}

export default ActionSmartCardsPage;

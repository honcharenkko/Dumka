import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import React, {useEffect, useMemo, useState} from "react";
import clsx from "clsx";

function ActionSmartTestPage({ material }) {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState({});
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  const [testAlreadyCompleted, setTestAlreadyCompleted] = useState(false);

const totalAnswers = correctCount + incorrectCount;

const correctPercent = totalAnswers ? (correctCount / totalAnswers) * 100 : 0;
const incorrectPercent = totalAnswers ? (incorrectCount / totalAnswers) * 100 : 0;




const progress = useMemo(() =>
  (correctCount / material.questions.length) * 100,
[correctCount, material.questions.length]);

  const handleAnswer = () => {
  if (testAlreadyCompleted || selectedOption === null) return;

  const currentQuestion = material.questions[currentQuestionIndex];
  const isCorrect = selectedOption === currentQuestion.correct_option;

  setAnswers((prev) => ({
    ...prev,
    [currentQuestionIndex]: { selected: selectedOption, isCorrect },
  }));

  if (isCorrect) {
    setCorrectCount((prev) => prev + 1);
  } else {
    setIncorrectCount((prev) => prev + 1);
  }

  setSelectedOption(null);

  if (currentQuestionIndex < material.questions.length - 1) {
    setCurrentQuestionIndex((prev) => prev + 1);
  }
};




const handleSaveStats = async () => {
  const correct_answers = [];
  const incorrect_answers = [];

  Object.entries(answers).forEach(([index, data]) => {
    if (data.isCorrect) {
      correct_answers.push(index);
    } else {
      incorrect_answers.push(index);
    }
  });

  const allCorrect = material.questions.length === correct_answers.length;

  const statPayload = {
    user_id: "", // TODO: замінити на реальний
    item_id: material._id,
    author_id: material.author_id,
    correct_answers: correct_answers,
    incorrect_answers: incorrect_answers,
    completed: allCorrect,
  };

  try {
    await axios.get(
      `http://localhost:8000/statistic_test/get_test_stat/${material._id}`,
      { withCredentials: true }
    );

    await axios.patch(
      `http://localhost:8000/statistic_test/update_test_stat/${material._id}`,
      statPayload,
      { withCredentials: true }
    );
  } catch (error) {
    if (error.response && error.response.status === 404) {
      await axios.post(
        "http://localhost:8000/statistic_test/insert_test_stat",
        statPayload,
        { withCredentials: true }
      );
    } else {
      console.error("Помилка при збереженні:", error);
    }
  }
};

useEffect(() => {
  if (!material?._id) return;

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/statistic_test/get_test_stat/${material._id}`,
        { withCredentials: true }
      );

      const { correct_answers = [], incorrect_answers = [] } = response.data;

      const loadedAnswers = {};
      correct_answers.forEach((id) => loadedAnswers[id] = { selected: null, isCorrect: true });
      incorrect_answers.forEach((id) => loadedAnswers[id] = { selected: null, isCorrect: false });

      setAnswers(loadedAnswers);
      setCorrectCount(correct_answers.length);
      setIncorrectCount(incorrect_answers.length);
      setTestAlreadyCompleted(true);
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error("Помилка при отриманні статистики:", error);
      }
    }
  };

  fetchStats();
}, [material?._id]);






const handleClearStats = async () => {
  try {
    await axios.delete(
      `http://localhost:8000/statistic_test/delete_test_stat/${material._id}`,
      { withCredentials: true }
    );

    setAnswers({});
    setCorrectCount(0);
    setIncorrectCount(0);
    setTestAlreadyCompleted(false);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
  } catch (error) {
    console.error("Помилка при очищенні статистики:", error);
  }
};





  const currentQuestion = material?.questions?.[currentQuestionIndex];

  return (
    <motion.div
initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.5 }}
  className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 max-w-7xl w-full px-4 md:px-8 pt-[100px] pb-16 font-sans"
>
 <div className="order-1 p-8 flex flex-col justify-between max-w-3xl w-full space-y-8">
  {currentQuestion ? (
    <>
      {/* Питання */}
      <div className="min-h-[200px] text-2xl font-semibold text-gray-800 bg-white p-6 rounded-3xl shadow-xl leading-relaxed tracking-wide">
        {currentQuestionIndex + 1}. {currentQuestion.question}
      </div>

      {/* Варіанти відповіді */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentQuestion.options.map((option, index) => {
          const isAnswered = answers[currentQuestionIndex];
          const isSelected = selectedOption === index;
          const wasSelected = isAnswered?.selected === index;

          return (
            <div
              key={index}
              onClick={() => !isAnswered && setSelectedOption(index)}
              className={clsx(
                "p-5 text-center rounded-2xl shadow-md cursor-pointer font-medium text-base md:text-lg transition-all duration-300 transform hover:scale-[1.02]",
                isAnswered
                  ? wasSelected
                    ? isAnswered.isCorrect
                      ? "bg-green-100 text-green-900 border border-green-300"
                      : "bg-red-100 text-red-800 border border-red-300"
                    : "bg-gray-100 text-gray-500"
                  : isSelected
                  ? "bg-blue-400 text-white"
                  : "bg-gray-50 hover:bg-blue-100 "
              )}
            >
              {option}
            </div>
          );
        })}
      </div>

      {/* Кнопка відповіді */}
      {!answers[currentQuestionIndex] && (
        <button
          onClick={handleAnswer}
          disabled={selectedOption === null}
          className="w-full mt-2 py-4 text-lg bg-blue-400 text-white font-bold rounded-2xl shadow-lg transition-all duration-300
            hover:brightness-110 active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
        >
          Відповісти
        </button>
      )}
    </>
  ) : (
    <p className="text-gray-500 text-center text-lg">Питань не знайдено</p>
  )}
</div>



  {/* Права частина — інфо + статистика + кнопки */}
<div className="order-2 flex flex-col gap-6">
  {/* Інфо */}
  <div className="rounded-2xl bg-white shadow-lg p-6 border border-gray-100">
    <h1 className="text-2xl font-bold text-gray-800 mb-2">{material.topic}</h1>
    <ul className="space-y-2 text-sm max-h-64 overflow-y-auto pr-1">
      {material.questions.map((q, idx) => {
        const answer = answers[idx];
        const isActive = idx === currentQuestionIndex;

        return (
          <li
            key={idx}
            onClick={() => {
              setCurrentQuestionIndex(idx);
              setSelectedOption(answer?.selected ?? null);
            }}
            className={clsx(
              "cursor-pointer p-2 rounded-xl transition font-medium",
              isActive && "bg-blue-400 text-white",
              !isActive && answer?.isCorrect && "bg-green-100 text-green-800",
              !isActive && answer && !answer.isCorrect && "bg-red-100 text-red-800",
              !answer && "hover:bg-blue-200"
            )}
          >
            {idx + 1}. {q.question.slice(0, 50)}...
          </li>
        );
      })}
    </ul>
  </div>

  {/* Статистика */}
  <div className="rounded-2xl bg-white shadow-lg p-6 border border-gray-100">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Статистика</h2>
    <div className="flex items-center gap-6">
      <div
        className="radial-progress text-green-600"
        style={{ "--value": progress }}
        role="progressbar"
      >
        {Math.round(progress)}%
      </div>
      <div className="space-y-2 text-sm flex-1">
        <div>
          <div className="flex justify-between text-green-700 font-semibold">
            <span>Правильних</span>
            <span>{correctCount}</span>
          </div>
          <progress
            className="progress progress-success w-full"
            value={correctPercent}
            max="100"
          />
        </div>
        <div>
          <div className="flex justify-between text-red-600 font-semibold">
            <span>Неправильних</span>
            <span>{incorrectCount}</span>
          </div>
          <progress
            className="progress progress-error w-full"
            value={incorrectPercent}
            max="100"
          />
        </div>
      </div>
    </div>

    {testAlreadyCompleted && (
      <div className="mt-6 p-4 bg-yellow-100 text-yellow-800 rounded-xl text-sm border border-yellow-300">
        Ви вже проходили цей тест. Щоб пройти ще раз — очистіть результат.
      </div>
    )}
  </div>

  {/* Кнопки */}
  <div className="flex flex-col gap-2">
    <button
      className="w-full bg-blue-400 hover:brightness-105 text-white rounded-xl font-semibold py-2 px-4 shadow-lg cursor-pointer"
      onClick={handleSaveStats}
    >
      Зберегти результат
    </button>
    <button
      className="w-full bg-red-400 hover:brightness-110 text-white rounded-xl font-semibold py-2 px-4 shadow-lg cursor-pointer"
      onClick={handleClearStats}
    >
      Очистити результат
    </button>
  </div>
</div>

</motion.div>

  );
}

export default ActionSmartTestPage;

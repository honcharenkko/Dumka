import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

function KnowledgeBasePage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
  if (!question.trim()) return;

  setLoading(true);
  setAnswer("");

  try {
  const response = await axios.post("http://localhost:8000/knowledge_base", {
    query: question,
  });

  if (response.data.answer) {
    setAnswer(response.data.answer);
  } else if (response.data.error) {
    setAnswer(response.data.error);
  } else {
    setAnswer("Невідома відповідь від сервера.");
  }

} catch (error) {
  setAnswer("Сталася помилка при запиті.");
  console.error(error);
} finally {
  setLoading(false);
}

};


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto px-6 md:px-10 pt-[120px] pb-24 font-sans text-gray-800"
    >
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold mb-6 leading-tight">
          Запитай у <span className="text-blue-400">Dumka</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Введи будь-яке запитання — від навчальних тем до фактів — і отримай розумну відповідь.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Наприклад: Що таке Kanban?"
          className="w-full h-32 p-4 rounded-xl border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4 text-lg"
        />

        <button
          onClick={handleAsk}
          disabled={loading}
          className="px-6 py-3 bg-blue-400 text-white text-lg rounded-xl font-semibold shadow-lg hover:brightness-105 transition-all disabled:opacity-60"
        >
          {loading ? "Зачекай..." : "Отримати відповідь"}
        </button>

        {answer && (
          <div className="mt-8 bg-gray-50 border border-gray-200 p-6 rounded-xl text-gray-800 text-lg leading-relaxed">
            <h3 className="text-2xl font-semibold text-blue-500 mb-2">Відповідь:</h3>
            {answer}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default KnowledgeBasePage;

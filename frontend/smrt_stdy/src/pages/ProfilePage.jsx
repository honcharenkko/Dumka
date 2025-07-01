import { motion } from "motion/react"
import {useEffect, useState} from "react";
import {LogOut} from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import {useNavigate} from "react-router-dom";



function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [userMaterials, setUserMaterials] = useState([]);

  const navigate = useNavigate();

  const smartCards = userMaterials.filter(m => m.type === "smart_cards");
  const tests = userMaterials.filter(m => m.type === "smart_test");
  const notes = userMaterials.filter(m => m.type === "smart_summary");

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (!token) return;

    axios.get("http://localhost:8000/user/me", { withCredentials: true })
      .then(res => setUserData(res.data))
      .catch(err => console.error("User fetch error:", err));

    axios.get("http://localhost:8000/material/get_material", { withCredentials: true })
      .then(res => setUserMaterials(res.data))
      .catch(err => console.error("Material fetch error:", err));
  }, []);

const logout = () => {
    axios.post("http://localhost:8000/auth/logout", {}, { withCredentials: true })
      .then(() => {
        navigate("/"); // React Router редірект
      })
      .catch(err => console.error("Logout error:", err));
  };

  const getInitials = (name) => {
    if (!name) return "??";
    const parts = name.trim().split(" ");
    return parts.map(p => p[0]).join("").toUpperCase().slice(0, 2);
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


  return (
    <div className="relative flex justify-center  p-6 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl px-4 md:px-8 pt-[100px] pb-16 font-sans"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-blue-200 text-blue-800 text-2xl font-bold">
              {userData ? getInitials(userData.full_name) : "?"}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-1">{userData?.full_name || "..."}</h2>
              <p className="text-gray-600 text-lg">{userData?.username || "..."}</p>
              <div className="mt-2 flex gap-3 text-sm text-gray-700">
                <span>Smart-картки: {smartCards.length}</span>
                <span>Тести: {tests.length}</span>
                <span>Конспекти: {notes.length}</span>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-3 rounded-xl bg-white text-[#ff4444] hover:scale-105 transition-all shadow-md cursor-pointer"
            title="Вийти"
          >
            <LogOut size={20} />
          </button>
        </div>

        {/* Матеріали */}
{userMaterials.length > 0 ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {userMaterials.map((material) => (
      <div
        key={material._id}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-transform duration-300 hover:scale-[1.015] flex flex-col"
      >
        <p className="text-sm text-gray-500 font-semibold mb-1">
          {getTranslatedTag(material.type)}
        </p>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {material.topic}
        </h3>
        <p className="text-sm text-gray-400 font-semibold mb-3">
          {material.num_cards
            ? `Карток: ${material.num_cards}`
            : material.num_questions
            ? `Питань: ${material.num_questions}`
            : `Абзаців: ${material.num_paragraphs}`}
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          {["detail_level", "text_style", "answer_format", "source"].map((field, idx) =>
            material[field] ? (
              <span
                key={idx}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  field === "detail_level"
                    ? "bg-green-100 text-green-700"
                    : field === "text_style"
                    ? "bg-blue-100 text-blue-700"
                    : field === "answer_format"
                    ? "bg-pink-100 text-pink-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {getTranslatedTag(material[field])}
              </span>
            ) : null
          )}
        </div>

        <div className="flex items-center justify-between mt-auto pt-1">
          <button
            onClick={() => navigate(`/materials/${material._id}`)}
            className="w-full py-2 px-4 text-white bg-blue-400 hover:brightness-105 rounded-xl text-sm font-semibold transition cursor-pointer"
          >
            Переглянути
          </button>
        </div>
      </div>
    ))}
  </div>
) : (
  <div className="flex flex-col items-center justify-center text-center mt-20">
    <p className="text-xl text-gray-600 mb-4">У вас ще немає жодного матеріалу.</p>
    <button
      onClick={() => navigate("/create")}
      className="px-6 py-3 bg-blue-400 hover:brightness-105 text-white text-sm font-semibold rounded-xl shadow-lg transition-all"
    >
      Згенеруйте перший матеріал
    </button>
  </div>
)}


      </motion.div>
    </div>
  );
}



export default ProfilePage;
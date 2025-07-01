import Theme from "../components/Theme.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import Cookies from "js-cookie";
import { motion } from "motion/react"

function FavoritePage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (token) {
      axios
        .get("http://localhost:8000/material/get_favourite_materials", {
          withCredentials: true,
        })
        .then((res) => {
          setFavorites(res.data); // Now we store the full material details, not just IDs
          setLoading(false); // Set loading to false after data is fetched
        })
        .catch((err) => {
          console.error("Помилка при отриманні обраних матеріалів:", err);
          setLoading(false); // Set loading to false in case of an error
        });
    }
  }, []);

  const toggleFavorite = async (id) => {
    try {
      if (favorites.some((material) => material._id === id)) {
        // Remove from favorites
        await axios.post(
          `http://localhost:8000/material/remove_material_from_favorites/${id}`,
          {},
          { withCredentials: true }
        );
        setFavorites(favorites.filter((fav) => fav._id !== id));
      } else {
        // Add to favorites
        await axios.post(
          `http://localhost:8000/material/add_material_to_favorites/${id}`,
          {},
          { withCredentials: true }
        );
        // You need to find the material by ID to add it fully
        const materialToAdd = await axios.get(
          `http://localhost:8000/material/${id}`, { withCredentials: true }
        );
        setFavorites([...favorites, materialToAdd.data]);
      }
    } catch (err) {
      alert("Помилка при зміні обраного");
      console.error(err);
    }
  };
const getInitials = (name) => {
  if (!name) return "??";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
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

  return (<div className="relative flex justify-center min-h-screen">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
    className="w-full max-w-7xl px-4 md:px-8 pt-[100px] pb-16 font-sans"
  >
    <h1 className="text-4xl font-bold mb-10 text-gray-800 text-center">
      Збережені матеріали
    </h1>

    {loading ? (
      <div className="flex justify-center">
        <span className="loading loading-dots loading-xl"></span>
      </div>
    ) : favorites.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites
          .filter((material) => material && material.topic)
          .map((material) => (
            <motion.div
              key={material._id}
              whileHover={{ scale: 1.02 }}
              className="relative bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex flex-col space-y-3 transition-transform"
            >
              {/* Кнопка "обране" */}
              <button
                onClick={() => toggleFavorite(material._id)}
                title="Видалити з обраного"
                className="absolute top-3 right-3 text-yellow-400 hover:text-yellow-500 transition cursor-pointer"
              >
                <Star
                  className={`w-6 h-6 ${
                    favorites.some((fav) => fav._id === material._id)
                      ? "fill-current text-yellow-500"
                      : "text-gray-400"
                  }`}
                />
              </button>
              <p className="text-sm text-gray-500 font-semibold">{getTranslatedTag(material.type)}</p>


              <h3 className="text-lg font-bold text-gray-800 leading-snug">{material.topic}</h3>

              {(material.num_cards || material.num_questions || material.num_paragraphs) && (
                <p className="text-sm text-gray-400 font-medium">
                  {material.num_cards
                    ? `Карток: ${material.num_cards}`
                    : material.num_questions
                    ? `Питань: ${material.num_questions}`
                    : `Абзаців: ${material.num_paragraphs}`}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
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

              <div className="flex items-center gap-3 pt-2 mt-auto border-t border-gray-200">
                <div className="bg-blue-100 text-blue-800 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold">
                  {getInitials(material.author_name)}
                </div>
                <span className="text-sm font-semibold text-gray-700">{material.author_name}</span>
                <button
                  onClick={() => navigate(`/materials/${material._id}`)}
                  className="ml-auto px-4 py-2 bg-blue-400 text-white text-sm rounded-xl hover:brightness-105 transition cursor-pointer"
                >
                  Переглянути
                </button>
              </div>
            </motion.div>
          ))}
      </div>
    ) : (
      <div className="col-span-full text-center mt-20">
        <div className="bg-white text-blue-700 p-8 rounded-2xl shadow-md inline-block max-w-xl">
          <div className="text-5xl mb-4">📭</div>
          <div className="font-semibold text-xl mb-3">Немає збережених матеріалів</div>
          <p className="text-md text-gray-700">
            Ви ще не додали жодного матеріалу в обране. Натискайте зірочку ⭐ на потрібних темах, щоб бачити їх тут.
          </p>
        </div>
      </div>
    )}
  </motion.div>
</div>


  );
}

export default FavoritePage;

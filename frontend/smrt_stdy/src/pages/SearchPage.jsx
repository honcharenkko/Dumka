import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Star, Search } from "lucide-react";
import { motion } from "framer-motion";

function SearchPage() {
  const [materials, setMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState(""); // окрема змінна для введення
  const [favorites, setFavorites] = useState([]);
  const [filters, setFilters] = useState({
    type: "",
    text_style: "",
    detail_level: "",
    source: "",
    sort_by: "newest",
    answer_format: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchMaterials = async () => {
    const token = Cookies.get("access_token");
    if (!token) {
      setError("Ви не авторизовані.");
      return;
    }

    setLoading(true);
    setError("");
    const params = {};

    if (searchTerm.trim()) params.search_query = searchTerm.trim();
    if (filters.type) params.type = filters.type;
    if (filters.text_style) params.text_style = filters.text_style;
    if (filters.detail_level) params.detail_level = filters.detail_level;
    if (filters.source) params.source = filters.source;
    if (filters.sort_by) params.sort_by = filters.sort_by;
    if (filters.answer_format) params.answer_format = filters.answer_format;

    try {
      const res = await axios.get("http://localhost:8000/material/get_all_users_materials", {
        params,
        withCredentials: true,
      });
      setMaterials(res.data);
    } catch (err) {
      console.error("Помилка при отриманні матеріалів:", err);
      setError("Не вдалося завантажити матеріали.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (token) {
      axios
        .get("http://localhost:8000/material/get_favourite_materials", { withCredentials: true })
        .then((res) => {
          setFavorites(res.data.map((item) => item._id));
        })
        .catch((err) => {
          console.error("Помилка при отриманні обраних матеріалів:", err);
        });
    }
  }, []);

  const toggleFavorite = async (id) => {
    try {
      if (favorites.includes(id)) {
        await axios.post(`http://localhost:8000/material/remove_material_from_favorites/${id}`, {}, { withCredentials: true });
        setFavorites(favorites.filter((favId) => favId !== id));
      } else {
        await axios.post(`http://localhost:8000/material/add_material_to_favorites/${id}`, {}, { withCredentials: true });
        setFavorites([...favorites, id]);
      }
    } catch (err) {
      alert("Помилка при зміні обраного");
      console.error(err);
    }
  };

  const getInitials = (name) => {
    if (!name) return "??";
    const parts = name.trim().split(" ");
    return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchClick = () => {
    setSearchTerm(inputValue);
  };

  // Оновлення результатів при зміні searchTerm або filters
  useEffect(() => {
    fetchMaterials();
  }, [searchTerm, filters]);


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

const translateBadge = (value) => badgeTranslation[value] || value;

  return (
    <div className="relative flex justify-center  min-h-screen">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-7xl px-4 md:px-8 pt-[100px] pb-16 font-sans"
    >
      {/* Пошук */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
        <input
          type="text"
          placeholder="Пошук матеріалів за темою..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 w-full px-5 py-4 rounded-2xl bg-white shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
        />
        <button
          onClick={handleSearchClick}
          className="flex items-center gap-2 px-6 py-4 bg-blue-400 text-white rounded-2xl font-semibold hover:brightness-105 transition cursor-pointer"
        >
          <Search className="w-5 h-5" />
          Пошук
        </button>
      </div>

      {/* Фільтри */}
      <div className="flex flex-wrap gap-4 mb-8">
        {["type", "text_style", "detail_level", "source", "sort_by", "answer_format"].map((field) => (
          <select
            key={field}
            name={field}
            value={filters[field]}
            onChange={handleFilterChange}
            className="flex-1 min-w-[150px] px-4 py-3 rounded-2xl bg-white shadow-lg text-gray-700 cursor-pointer"
          >
            {/* Варіанти фільтрів */}
            {field === "type" && <>
              <option value="">Тип: Усі</option>
              <option value="smart_cards">Картки</option>
              <option value="smart_test">Тести</option>
              <option value="smart_summary">Конспекти</option>
            </>}
            {field === "text_style" && <>
              <option value="">Стиль: Будь-який</option>
              <option value="formal">Формальний</option>
              <option value="conversational">Дружній</option>
            </>}
            {field === "detail_level" && <>
              <option value="">Деталізація: Будь-яка</option>
              <option value="brief">Низька</option>
              <option value="medium">Середня</option>
              <option value="detailed">Висока</option>
            </>}
            {field === "source" && <>
              <option value="">Джерело: Будь-яке</option>
              <option value="general">Загальне</option>
              <option value="it_project_mgmt">Управління ІТ-проєктами</option>
            </>}
            {field === "sort_by" && <>
              <option value="newest">Сортувати: Нові</option>
              <option value="oldest">Сортувати: Старі</option>
              <option value="alphabetical">За алфавітом</option>
            </>}
            {field === "answer_format" && <>
              <option value="">Категорія: Усі</option>
              <option value="description">Опис</option>
              <option value="instructions">Інструкції</option>
              <option value="comparison">Порівняння</option>
              <option value="conclusions">Висновки</option>
            </>}
          </select>
        ))}
      </div>

      {/* Контент */}
      {loading ? (
        <div className="text-center text-blue-600 font-bold text-xl">Завантаження...</div>
      ) : error ? (
        <div className="text-center text-red-500 font-semibold">{error}</div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {materials.length === 0 ? (
            <div className="text-center text-gray-500 text-lg font-semibold">
              Нічого не знайдено. Спробуйте змінити запит або фільтри.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.map((material) => (
                <motion.div
  key={material._id}
  whileHover={{ scale: 1.02 }}
  className="relative bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex flex-col space-y-3 transition-transform"
>
  {/* Кнопка обране */}
  <button
    onClick={() => toggleFavorite(material._id)}
    title="Додати в обране"
    className="absolute top-3 right-3 text-yellow-400 hover:text-yellow-500 transition cursor-pointer"
  >
    <Star
      className={`w-6 h-6 ${
        favorites.includes(material._id)
          ? "fill-current text-yellow-500"
          : "text-gray-400"
      }`}
    />
  </button>


   <p className="text-sm text-gray-500 font-semibold">{translateBadge(material.type)}</p>


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

  {/* Бейджі */}
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
          {translateBadge(material[field])}
        </span>
      ) : null
    )}
  </div>

  {/* Автор + Кнопка */}
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
          )}
        </motion.div>
      )}
    </motion.div>
  </div>
  );
}

export default SearchPage;

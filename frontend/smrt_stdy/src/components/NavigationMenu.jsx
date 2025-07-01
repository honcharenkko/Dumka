import '../App.css';
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { motion } from "framer-motion";

function NavigationMenu() {
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();






  useEffect(() => {
    const token = Cookies.get("access_token");
    if (token) {
      axios.get("http://localhost:8000/user/me", { withCredentials: true })
        .then((response) => setUserData(response.data.full_name))
        .catch((error) =>
          console.error("Помилка при отриманні даних:", error.response?.data || error.message)
        );
    }
  }, []);


  const getInitials = (name) => {
    if (!name) return "??";
    const parts = name.trim().split(" ");
    return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
  };

  const isActive = (path) => location.pathname === path;

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (<div className="w-full bg-base-100 text-base-content flex items-center justify-between px-4 py-2 shadow-md fixed top-0 left-0 z-50 h-[70px]">

  {/* Логотип */}
  <div className="flex items-center gap-3 flex-shrink-0">
    <img
      src="/dumka_logo_new.svg"
      alt="Description"
      className="w-15 h-15 rounded-full"  // Відступ праворуч між зображенням і текстом
    />
    <span className="text-3xl font-bold hidden sm:inline">Dumka</span>
  </div>

  {/* Центрований контейнер навігації */}
  <div className="flex-1 flex justify-center">
    <nav className="flex gap-4 md:gap-6">
      {[{ to: "/", icon: "home", label: "Головна" }, { to: "/search", icon: "search", label: "Пошук" }, { to: "/favorites", icon: "bookmark", label: "Збережене" }, { to: "/library", icon: "collection", label: "База знань" }].map(({ to, icon, label }, idx) => (
        <motion.button
          whileHover={{ scale: 1.05 }}
          key={idx}
          onClick={() => handleNavigate(to)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium ${isActive(to) ? 'bg-blue-400 text-white' : 'hover:bg-blue-50 text-gray-700'} transition-all duration-200 cursor-pointer`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {icon === "home" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l9-9 9 9M4 10v10h16V10" />}
            {icon === "search" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />}
            {icon === "bookmark" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5v14l7-5 7 5V5a2 2 0 00-2-2H7a2 2 0 00-2 2z" />}
            {icon === "collection" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 19.5A2.5 2.5 0 016.5 17H20m-13.5 0A2.5 2.5 0 014 14.5V5.5A2.5 2.5 0 016.5 3h13A2.5 2.5 0 0122 5.5v9a2.5 2.5 0 01-2.5 2.5H6.5z" />}
          </svg>
          <span className="hidden sm:inline">{label}</span>
        </motion.button>
      ))}
    </nav>
  </div>

  {/* Профіль */}
{userData ? (
  <motion.button
    whileHover={{ scale: 1.05 }}
    onClick={() => handleNavigate("/profile")}
    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-blue-50 transition-all cursor-pointer flex-shrink-0"
  >
    <div className="rounded-full bg-blue-100 text-blue-800 w-10 h-10 flex items-center justify-center font-semibold">
      {getInitials(userData)}
    </div>
    <div className="hidden md:flex flex-col">
      <span className="text-sm font-semibold">{userData}</span>
    </div>
  </motion.button>
) : (
  <div className="flex items-center gap-2 flex-shrink-0">
    {/* Кнопка Вхід */}
    <motion.button
      whileHover={{ scale: 1.05 }}
      onClick={() => handleNavigate("/login")}
      className="flex items-center justify-center px-4 py-2 rounded-xl bg-blue-500 text-white font-semibold hover:brightness-105 transition-all cursor-pointer text-sm sm:text-base"
    >
      Вхід
    </motion.button>

    {/* Кнопка Реєстрація */}
    <motion.button
      whileHover={{ scale: 1.05 }}
      onClick={() => handleNavigate("/signup")}
      className="hidden sm:flex items-center justify-center px-4 py-2 rounded-xl border border-blue-500 text-blue-500 font-semibold hover:bg-blue-50 transition-all cursor-pointer text-sm sm:text-base"
    >
      Реєстрація
    </motion.button>
  </div>
)}

</div>



  );
}

export default NavigationMenu;


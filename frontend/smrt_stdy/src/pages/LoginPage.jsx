import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css"; // Імпортуємо стилі для Toast

function LoginPage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/signup'); // Змініть шлях на потрібний
  };

  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const sendUserData = () => {
    if (!user.username.trim()) {
      console.error("Ім'я користувача не може бути порожнім");
      toast.error("Ім'я користувача не може бути порожнім"); // Тост для порожнього імені
      return;
    }

    axios
      .post("http://localhost:8000/auth/login", user, {
        withCredentials: true,
      })
      .then((res) => {
        console.log("Відповідь сервера:", res.data);
        setUsers(res.data.Users || []); // Безопасная проверка
        setUser({ username: "", password: "" }); // Очищаем поля
        navigate("/", { replace: true });
        window.history.replaceState(null, "", window.location.href);
        toast.success("Успішний вхід!"); // Успішний вхід
      })
      .catch((err) => {
        console.error("Помилка:", err.response?.data || err.message);
        // Тости для різних помилок
        if (err.response) {
          const errorMessage = err.response.data.detail || "Щось пішло не так.";
          if (err.response.status === 401) {
            toast.error("Невірний логін або пароль.");
          } else if (err.response.status === 404) {
            toast.error("Користувач не знайдений.");
          } else if (err.response.status === 503) {
            toast.error("Проблеми з підключенням до бази даних. Спробуйте пізніше.");
          } else {
            toast.error(errorMessage);
          }
        } else {
          toast.error("Невідома помилка. Перевірте підключення до Інтернету.");
        }
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen w-full flex flex-col text-gray-800 font-sans relative"
    >
      {/* Логотип зверху зліва */}
<div className="flex items-center absolute top-4 left-4 z-10">
  <button
    onClick={() => navigate('/')}
    className="text-3xl font-bold flex items-center sm:inline text-gray-800 hover:text-blue-500 transition-colors cursor-pointer"
  >
    <img
      src="/dumka_logo_new.svg"
      alt="Description"
      className="w-20 h-20 rounded-full mr-2"  // Відступ праворуч між зображенням і текстом
    />
  </button>
</div>

      {/* Центрована форма */}
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-md rounded-3xl p-10 bg-base-100 shadow-lg">
          <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">Увійдіть в систему</h1>

          <form className="space-y-6">
            <div>
              <label className="block mb-2 font-medium text-blue-700">Email</label>
              <input
                type="text"
                name="username"
                value={user.username}
                onChange={handleUserChange}
                required
                placeholder="Email"
                className="w-full px-4 py-3 rounded-xl bg-base-100 shadow-[inset_2px_2px_8px_#cfe7d6,inset_-2px_-2px_8px_#ffffff] focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-blue-700">Пароль</label>
              <input
                type="password"
                name="password"
                value={user.password}
                onChange={handleUserChange}
                required
                placeholder="Пароль"
                className="w-full px-4 py-3 rounded-xl bg-base-100 shadow-[inset_2px_2px_8px_#cfe7d6,inset_-2px_-2px_8px_#ffffff] focus:outline-none"
              />
            </div>

            <div className="space-y-4 pt-4">
              <button
                type="button"
                onClick={sendUserData}
                className="w-full py-3 rounded-xl font-semibold text-white bg-blue-400 shadow-lg hover:brightness-105 transition-all duration-200 cursor-pointer"
              >
                Увійти
              </button>

              <button
                type="button"
                onClick={handleClick}
                className="w-full py-3 rounded-xl font-semibold text-blue-700 bg-base-100 shadow-[inset_2px_2px_8px_#cfe7d6,inset_-2px_-2px_8px_#ffffff] hover:shadow-[2px_2px_12px_#b0d4bb,-2px_-2px_12px_#ffffff] hover:bg-[#f0fef4] transition-all duration-100 cursor-pointer"
              >
                Реєстрація
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Додаємо контейнер для тостів */}
      <ToastContainer />
    </motion.div>
  );
}

export default LoginPage;


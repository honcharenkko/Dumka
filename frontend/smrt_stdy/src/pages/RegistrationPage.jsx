import { ToastContainer, toast } from "react-toastify"; // Імпортуємо тости
import "react-toastify/dist/ReactToastify.css"; // Стилі для тостів
import Theme from "../components/Theme.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function RegistrationPage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/login'); // Змініть шлях на потрібний
  };

  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({
    full_name: "",
    username: "",
    password: "",
    confirmPassword: ""
  });

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const sendUser = () => {
    if (!user.username.trim()) {
      toast.error("Ім'я користувача не може бути порожнім"); // Тост при порожньому username
      return;
    }

    if (user.password !== user.confirmPassword) {
      toast.error("Паролі не співпадають"); // Тост при невідповідності паролів
      return;
    }

    const userData = {
      full_name: user.full_name,
      username: user.username,
      password: user.password,
    };

    axios
      .post("http://localhost:8000/auth/signup", userData)
      .then((res) => {
        console.log("Відповідь сервера:", res.data);
        setUsers(res.data.Users);
        setUser({
          full_name: "",
          username: "",
          password: "",
          confirmPassword: "",
        }); // Очищаємо поля після успішної реєстрації

        toast.success("Реєстрація успішна!"); // Тост при успішній реєстрації
      })
      .catch((err) => {
        console.error("Помилка:", err);
        toast.error("Сталася помилка при реєстрації. Спробуйте ще раз."); // Тост при помилці
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen w-full flex flex-col  text-gray-800 font-sans relative"
    >
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
          <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">Реєстрація</h1>

          <form className="space-y-6">
            <div>
              <label className="block mb-2 font-medium text-blue-700">Повне ім'я</label>
              <input
                type="text"
                name="full_name"
                value={user.full_name}
                onChange={handleUserChange}
                required
                placeholder="Ваше ім’я"
                className="w-full px-4 py-3 rounded-xl bg-base-100 shadow-[inset_2px_2px_8px_#cfe7d6,inset_-2px_-2px_8px_#ffffff] focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-blue-700">Email</label>
              <input
                type="email"
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

            <div>
              <label className="block mb-2 font-medium text-blue-700">Підтвердіть пароль</label>
              <input
                type="password"
                name="confirmPassword"
                value={user.confirmPassword}
                onChange={handleUserChange}
                required
                placeholder="Повторіть пароль"
                className="w-full px-4 py-3 rounded-xl bg-base-100 shadow-[inset_2px_2px_8px_#cfe7d6,inset_-2px_-2px_8px_#ffffff] focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={sendUser}
              className="w-full py-3 rounded-xl font-semibold text-white bg-blue-400  shadow-lg cursor-pointer hover:brightness-105 transition-all duration-200"
            >
              Зареєструватися
            </button>

            <button
              type="button"
              onClick={handleClick}
              className="w-full py-3 rounded-xl font-semibold text-blue-700 bg-base-100 shadow-[inset_2px_2px_8px_#cfe7d6,inset_-2px_-2px_8px_#ffffff] hover:shadow-[2px_2px_12px_#b0d4bb,-2px_-2px_12px_#ffffff] hover:bg-[#f0fef4] transition-all duration-100 cursor-pointer"
            >
              Увійти
            </button>
          </form>
        </div>
      </div>

      {/* Додамо контейнер для відображення тостів */}
      <ToastContainer />
    </motion.div>
  );
}

export default RegistrationPage;


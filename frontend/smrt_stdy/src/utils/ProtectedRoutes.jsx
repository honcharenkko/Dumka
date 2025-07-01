import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTokenFromCookie, isTokenValid } from "../config/auth.js";

const ProtectedRoutes = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // Стан для зберігання статусу авторизації
    const token = getTokenFromCookie(); // Отримуємо токен з куків

    useEffect(() => {
        if (!token || !isTokenValid(token)) {
            // Якщо токен відсутній або прострочений — видаляємо його
            document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            setIsAuthenticated(false); // Встановлюємо статус неавторизованого користувача
        } else {
            setIsAuthenticated(true); // Токен валідний, користувач авторизований
        }
    }, [token]);

    if (isAuthenticated === null) {
        // Якщо стан не визначено (запит ще в процесі) — можна відобразити завантаження або нічого не показувати
        return null;
    }

    if (isAuthenticated === false) {
        // Якщо користувач не авторизований — перенаправляємо на логін
        return <Navigate to="/login" replace />;
    }

    return <Outlet />; // Якщо користувач авторизований, відображаємо дочірні компоненти
};

export default ProtectedRoutes;

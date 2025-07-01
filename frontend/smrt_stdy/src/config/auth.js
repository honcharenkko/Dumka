// Функція для отримання токена з куків
export const getTokenFromCookie = () => {
  const name = "access_token=";
  const decodedCookie = document.cookie.split("; ");
  const cookie = decodedCookie.find(c => c.startsWith(name));

  return cookie ? cookie.substring(name.length) : ""; // Повертаємо тільки значення токена
};

// Функція для перевірки чи токен дійсний
export const isTokenValid = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // Декодуємо payload токена
    const currentTime = Math.floor(Date.now() / 1000); // Поточний час в секундах
    return payload.exp > currentTime; // Перевіряємо, чи не минув термін дії токена
  } catch (error) {
    console.error("Помилка при перевірці токена:", error);
    return false;
  }
};

export const isAuthenticated = () => {
  const token = getTokenFromCookie(); // Отримуємо токен з куки
  console.log("Токен з куки:", token); // Дебаг: виведення токена в консоль
  const valid = token && isTokenValid(token); // Перевірка, чи токен існує і чи валідний
  console.log("Авторизація: ", valid); // Дебаг: чи токен валідний
  return valid;
};


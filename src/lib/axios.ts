import type { AxiosError } from "axios";
// eslint-disable-next-line no-duplicate-imports
import axios from "axios";
import { useAuthStore } from "../store/auth"; // <-- правильный импорт Zustand стора

// === СОЗДАЁМ КЛИЕНТ ===
const apiClient = axios.create({
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	baseURL: import.meta.env["VITE_API_BASE_URL"],
	headers: {
		"Content-Type": "application/json",
	},
});

// ========================================================
// 1️⃣ REQUEST INTERCEPTOR — добавляет токен в запросы
// ========================================================
apiClient.interceptors.request.use((config) => {
	// Берём токен из Zustand
	const token = useAuthStore.getState().token;

	// Если токен есть, добавляем его в заголовок
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

// ========================================================
// 2️⃣ RESPONSE INTERCEPTOR — обрабатывает ошибки
// ========================================================
apiClient.interceptors.response.use(
	(response) => response,

	(error: AxiosError<{ message?: string }>) => {
		const message = error.response?.data?.message ?? error.message;

		console.error("API Error:", message);

		// Если сервер говорит "Unauthorized" → токен неверный или истёк
		if (error.response?.status === 401) {
			// Удаляем токен из Zustand
			useAuthStore.getState().clearToken();

			// Перенаправляем пользователя на форму логина
			window.location.href = "/login";
		}

		// Пробрасываем ошибку дальше
		return Promise.reject(new Error(message));
	}
);

export default apiClient;

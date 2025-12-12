import type { AxiosError } from "axios";
// eslint-disable-next-line no-duplicate-imports
import axios from "axios";
import { useAuthStore } from "../store/auth"; // Тут зустик

const apiClient = axios.create({
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	baseURL: import.meta.env["VITE_API_BASE_URL"],
	headers: {
		"Content-Type": "application/json",
	},
});

// ========================================================
// REQUEST INTERCEPTOR — добавляет токен в запросы
// ========================================================
apiClient.interceptors.request.use((config) => {
	const token = useAuthStore.getState().token;
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

// ========================================================
// RESPONSE INTERCEPTOR — обрабатывает ошибки
// ========================================================
apiClient.interceptors.response.use(
	(response) => response,

	(error: AxiosError<{ message?: string }>) => {
		const message = error.response?.data?.message ?? error.message;

		console.error("API Error:", message);

		// Если сервер говорит, что чел не при делах или токен истек, то бан, возарщая к логину
		if (error.response?.status === 401) {
			useAuthStore.getState().clearToken();

			window.location.href = "/login";
		}

		return Promise.reject(new Error(message));
	}
);

export default apiClient;

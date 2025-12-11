import type { AxiosError } from "axios";
// eslint-disable-next-line no-duplicate-imports
import axios from "axios";
import { useAuthStore } from "../store/auth";

const apiClient = axios.create({
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	baseURL: import.meta.env["VITE_API_BASE_URL"],
	headers: {
		"Content-Type": "application/json",
	},
});

// === REQUEST INTERCEPTOR ===
apiClient.interceptors.request.use((config) => {
	const token = useAuthStore.getState().token;

	if (token) config.headers.Authorization = `Bearer ${token}`;

	return config;
});

// === RESPONSE INTERCEPTOR ===
apiClient.interceptors.response.use(
	(res) => res,
	(error: AxiosError<{ message?: string }>) => {
		const message = error.response?.data?.message ?? error.message;

		console.error("API Error:", message);

		// Авто-выход если токен просрочен
		if (error.response?.status === 401) {
			useAuthStore.getState().clearToken();
			window.location.href = "/login";
		}

		return Promise.reject(new Error(message));
	}
);

export default apiClient;

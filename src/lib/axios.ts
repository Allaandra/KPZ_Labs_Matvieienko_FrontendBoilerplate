import type { AxiosError } from "axios";
// eslint-disable-next-line no-duplicate-imports
import axios from "axios";

const apiClient = axios.create({
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	baseURL: import.meta.env["VITE_API_BASE_URL"],
	headers: {
		"Content-Type": "application/json",
	},
});

// Токен из env
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const token = import.meta.env["VITE_API_AUTH_TOKEN"];

if (typeof token === "string" && token.length > 0) {
	apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Интерцептор ответов
apiClient.interceptors.response.use(
	(response) => response,
	(error_) => {
		const error = error_ as AxiosError<{ message?: string }>;
		const message =
			error.response?.data?.message || error.message || "Unknown API error";

		console.error("API Error:", message);

		return Promise.reject(new Error(message));
	}
);

export default apiClient;

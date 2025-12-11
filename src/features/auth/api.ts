import { useMutation } from "@tanstack/react-query";
import apiClient from "../../lib/axios";
import { useAuthStore } from "../../store/auth";

interface LoginDTO {
	email: string;
	password: string;
}

interface LoginResponse {
	message: string;
	data: string; // содержит "Bearer <token>"
}

export const useLogin = () => {
	const setToken = useAuthStore((s) => s.setToken);

	return useMutation({
		mutationFn: async (dto: LoginDTO) => {
			const res = await apiClient.post<LoginResponse>("/auth/login", dto);
			return res.data;
		},

		onSuccess: (data) => {
			const raw = data.data; // "Bearer <token>"
			const token = raw?.split(" ")[1] ?? null; // теперь всегда string | null

			setToken(token);

		},
	});
};
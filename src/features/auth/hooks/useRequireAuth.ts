import { useAuthStore } from "../../../store/auth.ts";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export function useRequireAuth() {
	const token = useAuthStore((s) => s.token);
	const navigate = useNavigate();

	useEffect(() => {
		if (!token) {
			navigate({ to: "/login" });
		}
	}, [token, navigate]);
}

import type { ReactElement } from "react";
import { Link } from "@tanstack/react-router";
import { useAuthStore } from "../store/auth.ts";
import { useRequireAuth } from "../features/auth/hooks/useRequireAuth.ts";

export function Home(): ReactElement {
	useRequireAuth();

	const clearToken = useAuthStore((s) => s.clearToken);

	const handleLogout = (): void => {
		clearToken();
		window.location.href = "/login";
	};

	return (
		<div className="min-h-screen bg-[#D7EFFF] flex justify-center items-center p-6">

			{/* CARD */}
			<div className="w-full max-w-xl bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/40 space-y-8 text-center">

				<h1 className="text-3xl font-bold text-[#3A506B]">
					Панель управління
				</h1>

				<p className="text-[#4B3B47]">
					Оберіть розділ для роботи
				</p>

				{/* BUTTONS */}
				<div className="flex flex-col space-y-4 mt-6">

					<Link
						className="px-6 py-3 bg-[#FFBCD9] hover:bg-[#FF8FC3] text-[#4B3B47] rounded-xl font-medium transition text-lg shadow"
						to="/groups"
					>
						Групи
					</Link>

					<Link
						className="px-6 py-3 bg-[#FFBCD9] hover:bg-[#FF8FC3] text-[#4B3B47] rounded-xl font-medium transition text-lg shadow"
						to="/children"
					>
						Діти
					</Link>
				</div>

				{/* LOGOUT */}
				<button
					className="mt-8 px-4 py-2 bg-red-400 hover:bg-red-500 text-white rounded-lg transition"
					onClick={handleLogout}
				>
					Вийти
				</button>
			</div>
		</div>
	);
}

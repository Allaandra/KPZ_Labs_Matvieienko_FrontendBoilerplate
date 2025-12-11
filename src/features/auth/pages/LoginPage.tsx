import type { ReactElement } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "../api";
import { useNavigate } from "@tanstack/react-router";
import { useRequireAuth } from "../hooks/useRequireAuth.ts";

const loginSchema = z.object({
	email: z.string().email("Некоректний email"),
	password: z.string().min(4, "Мінімум 4 символи"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage(): ReactElement {
	useRequireAuth();

	const loginMutation = useLogin();
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginForm>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (data: LoginForm) => {
		try {
			await loginMutation.mutateAsync(data);
			navigate({ to: "/" }); // перенаправление після входу
		} catch (error) {
			alert("Невірні дані для входу.");
		}
	};

	return (
		<div className="min-h-screen bg-[#D7EFFF] flex justify-center items-center">
			<div className="w-full max-w-md bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/40 space-y-6">
				<h1 className="text-3xl font-bold text-center text-[#4B3B47]">Вхід</h1>

				<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
					<div>
						<label className="font-medium text-[#4B3B47]">Email</label>
						<input
							className="w-full rounded-lg border border-[#FFBCD9] bg-white/80 p-2"
							type="email"
							{...register("email")}
						/>
						{errors.email && (
							<p className="text-[#C94A6A]">{errors.email.message}</p>
						)}
					</div>

					<div>
						<label className="font-medium text-[#4B3B47]">Пароль</label>
						<input
							className="w-full rounded-lg border border-[#FFBCD9] bg-white/80 p-2"
							type="password"
							{...register("password")}
						/>
						{errors.password && (
							<p className="text-[#C94A6A]">{errors.password.message}</p>
						)}
					</div>

					<button
						className="w-full rounded-lg bg-[#FFBCD9] hover:bg-[#FF8FC3] py-2 font-semibold text-[#4B3B47]"
						disabled={isSubmitting || loginMutation.isPending}
					>
						Увійти
					</button>
				</form>
			</div>
		</div>
	);
}

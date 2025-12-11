import type { ReactElement } from "react";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCreateGroup } from "../api";
import type { CreateGroupDTO } from "../types";
import { useRequireAuth } from "../../auth/hooks/useRequireAuth.ts";

// 🎯 Zod схема валідації
const groupCreateSchema = z.object({
	name: z.string().min(2, "Назва групи повинна містити мінімум 2 символи"),
});

export type GroupCreateFormData = z.infer<typeof groupCreateSchema>;

export function GroupCreatePage(): ReactElement {
	useRequireAuth();

	const createMutation = useCreateGroup();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<GroupCreateFormData>({
		resolver: zodResolver(groupCreateSchema),
	});

	const onSubmit = (data: CreateGroupDTO): void => {
		createMutation.mutate(data);
	};

	return (
		<div className="min-h-screen bg-[#D7EFFF] flex justify-center items-center p-6">
			{/* CARD */}
			<div className="w-full max-w-md bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/40 space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<h1 className="text-3xl font-bold text-[#3A506B]">
						Створення групи
					</h1>

					<Link
						className="px-4 py-2 rounded-lg font-medium text-[#4B3B47] bg-[#FFBCD9] hover:bg-[#FF8FC3] transition"
						to="/groups"
					>
						Назад
					</Link>
				</div>

				{/* Форма створення */}
				<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
					<div>
						<label className="font-medium text-[#4B3B47]">
							Назва групи
						</label>
						<input
							className="w-full rounded-lg border border-[#FFBCD9] bg-white/80 p-2 text-[#4B3B47] focus:border-[#FF8FC3] focus:ring-2 focus:ring-[#FFBCD9] outline-none transition"
							type="text"
							{...register("name")}
						/>

						{errors.name && (
							<p className="text-[#C94A6A] text-sm mt-1">
								{errors.name.message}
							</p>
						)}
					</div>

					<button
						className="w-full rounded-lg bg-[#FFBCD9] hover:bg-[#FF8FC3] text-[#4B3B47] font-semibold py-2 transition disabled:bg-[#E8C4D0]"
						disabled={isSubmitting || createMutation.isPending}
						type="submit"
					>
						Створити
					</button>
				</form>
			</div>
		</div>
	);
}

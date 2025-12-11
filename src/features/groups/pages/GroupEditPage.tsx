import type { ReactElement } from "react";
import { useParams, Link } from "@tanstack/react-router";
// eslint-disable-next-line no-duplicate-imports
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useGroup, useUpdateGroup } from "../api";
import type { CreateGroupDTO } from "../types";
import { useRequireAuth } from "../../auth/hooks/useRequireAuth.ts";

// 🎯 Zod схема
const groupEditSchema = z.object({
	name: z.string().min(2, "Назва групи повинна містити мінімум 2 символи"),
});

export type GroupEditFormData = z.infer<typeof groupEditSchema>;

export function GroupEditPage(): ReactElement {
	useRequireAuth();

	const { groupId } = useParams({ from: "/groups/$groupId" });

	const { data: group, isLoading, isError, error } = useGroup(Number(groupId));
	const updateMutation = useUpdateGroup();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<GroupEditFormData>({
		resolver: zodResolver(groupEditSchema),
	});

	// 🎯 Заполняем форму, когда данные пришли
	useEffect(() => {
		if (group) {
			reset({ name: group.name });
		}
	}, [group, reset]);

	const onSubmit = (data: CreateGroupDTO): void => {
		updateMutation.mutate({
			id: Number(groupId),
			data,
		});
	};

	if (isLoading) return <div className="p-4">Завантаження групи...</div>;
	if (isError)
		return (
			<div className="p-4 text-red-400">
				Помилка: {(error).message}
			</div>
		);
	if (!group) return <div className="p-4">Групу не знайдено</div>;

	return (
		<div className="min-h-screen bg-[#D7EFFF] flex justify-center items-center p-6">
			{/* CARD */}
			<div className="w-full max-w-md bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/40 space-y-6">

				{/* Header */}
				<div className="flex items-center justify-between">
					<h1 className="text-3xl font-bold text-[#3A506B]">
						Редагування групи
					</h1>

					<Link
						className="px-4 py-2 rounded-lg font-medium text-[#4B3B47] bg-[#FFBCD9] hover:bg-[#FF8FC3] transition"
						to="/groups"
					>
						Назад
					</Link>
				</div>

				{/* FORM */}
				<form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

					{/* OLD VALUE */}
					<div className="text-sm text-[#7A496A] bg-[#FFE6F0] px-3 py-1 rounded-lg w-fit shadow-sm">
						Було: <span className="font-semibold">{group.name}</span>
					</div>

					{/* INPUT */}
					<div>
						<label className="font-medium text-[#4B3B47]">
							Нова назва групи
						</label>

						<input
							type="text"
							className="w-full rounded-lg border border-[#FFBCD9] bg-white/80 p-2 text-[#4B3B47] 
							focus:border-[#FF8FC3] focus:ring-2 focus:ring-[#FFBCD9] outline-none transition"
							{...register("name")}
						/>

						{errors.name && (
							<p className="text-[#C94A6A] text-sm mt-1">
								{errors.name.message}
							</p>
						)}
					</div>

					{/* BUTTON */}
					<button
						disabled={isSubmitting || updateMutation.isPending}
						type="submit"
						className="w-full rounded-lg bg-[#FFBCD9] hover:bg-[#FF8FC3] 
						text-[#4B3B47] font-semibold py-2 transition disabled:bg-[#E8C4D0]"
					>
						Зберегти зміни
					</button>
				</form>

			</div>
		</div>
	);
}

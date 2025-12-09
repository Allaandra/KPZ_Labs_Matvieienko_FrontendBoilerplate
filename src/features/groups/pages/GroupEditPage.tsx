import type { ReactElement } from "react";
import { useParams, Link } from "@tanstack/react-router";
// eslint-disable-next-line no-duplicate-imports
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useGroup, useUpdateGroup } from "../api";
import type { CreateGroupDTO } from "../types";

// 🎯 Zod схема валідації
const groupEditSchema = z.object({
	name: z.string().min(2, "Назва групи повинна містити мінімум 2 символи"),
});

export type GroupEditFormData = z.infer<typeof groupEditSchema>;

export function GroupEditPage(): ReactElement {
	const { groupId } = useParams({ from: "/groups/$groupId" });

	const {
		data: group,
		isLoading,
		isError,
		error,
	} = useGroup(Number(groupId));

	const updateMutation = useUpdateGroup();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<GroupEditFormData>({
		resolver: zodResolver(groupEditSchema),
	});

	// 🎯 Коли дані групи завантажені – заповнюємо форму
	useEffect(() => {
		if (group) {
			reset({
				name: group.name,
			});
		}
	}, [group, reset]);

	// 🎯 Обробка сабміту
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
		<div className="p-6 max-w-lg space-y-6">
			{/* Верхня панель */}
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Редагування групи</h1>

				<Link
					className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
					to="/groups"
				>
					Назад
				</Link>
			</div>

			{/* Форма */}
			<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
				{/* Поле "name" */}
				<div>
					<label className="font-medium">Назва групи</label>
					<input
						className="w-full rounded border border-white bg-transparent p-2 text-white"
						type="text"
						{...register("name")}
					/>
					{errors.name && (
						<p className="text-red-400">{errors.name.message}</p>
					)}
				</div>

				{/* Кнопка */}
				<button
					className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:bg-gray-400"
					disabled={isSubmitting || updateMutation.isPending}
					type="submit"
				>
					Зберегти зміни
				</button>
			</form>
		</div>
	);
}

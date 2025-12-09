import type { ReactElement } from "react";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCreateGroup } from "../api";
import type { CreateGroupDTO } from "../types";

// 🎯 Zod схема валідації
const groupCreateSchema = z.object({
	name: z.string().min(2, "Назва групи повинна містити мінімум 2 символи"),
});

export type GroupCreateFormData = z.infer<typeof groupCreateSchema>;

export function GroupCreatePage(): ReactElement {
	const createMutation = useCreateGroup();

	// 🎯 React Hook Form + Zod
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<GroupCreateFormData>({
		resolver: zodResolver(groupCreateSchema),
	});

	// 🎯 Відправка форми
	const onSubmit = (data: CreateGroupDTO): void => {
		createMutation.mutate(data);
	};

	return (
		<div className="p-6 max-w-lg space-y-6">
			{/* Верхня панель */}
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Створення групи</h1>

				<Link
					className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
					to="/groups"
				>
					Назад
				</Link>
			</div>

			{/* Форма створення */}
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
					disabled={isSubmitting || createMutation.isPending}
					type="submit"
				>
					Створити
				</button>
			</form>
		</div>
	);
}

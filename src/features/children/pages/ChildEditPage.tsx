import type { ReactElement } from "react";
import { Link, useParams } from "@tanstack/react-router";
// eslint-disable-next-line no-duplicate-imports
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useChild, useUpdateChild } from "../api";
import { useGroups } from "../../groups/api";
import { formatDate } from "../../../utils/formatDate.ts";

// ----------------------
// ZOD SCHEMA
// ----------------------
const childEditSchema = z.object({
	firstName: z.string().min(2, "Імʼя занадто коротке"),
	lastName: z.string().min(2, "Прізвище занадто коротке"),
	patronymic: z.string().min(2, "По батькові занадто коротке"),
	birthdayDate: z.string().min(1, "Оберіть дату народження"),
	groupId: z.coerce.number().min(1, "Оберіть групу"),
});

type ChildEditFormData = z.infer<typeof childEditSchema>;

// ----------------------
// COMPONENT
// ----------------------
export function ChildEditPage(): ReactElement {
	const { childId } = useParams({ from: "/children/$childId" });

	const { data: child, isLoading, isError, error } = useChild(Number(childId));
	const { data: groups } = useGroups();

	const updateMutation = useUpdateChild();

	const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
		useForm({
			resolver: zodResolver(childEditSchema),
		});

	// Заполняем форму начальными значениями
	useEffect(() => {
		if (child) {
			reset({
				firstName: child.firstName,
				lastName: child.lastName,
				patronymic: child.patronymic,
				birthdayDate: child.birthdayDate,
				groupId: child.group.id,
			});
		}
	}, [child, reset]);

	const onSubmit = (data: ChildEditFormData): void => {
		updateMutation.mutate({
			id: Number(childId),
			data: { ...data, groupId: Number(data.groupId) },
		});
	};

	if (isLoading) return <div>Завантаження...</div>;
	if (isError) return <div className="text-red-400">Помилка: {(error).message}</div>;

	return (
		<div className="min-h-screen bg-[#D7EFFF] flex justify-center items-center p-6">
			<div className="w-full max-w-2xl bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/40 space-y-8">

				{/* HEADER */}
				<div className="flex items-center justify-between">
					<h1 className="text-3xl font-bold text-[#3A506B]">Редагувати дитину</h1>

					<Link
						className="px-4 py-2 rounded-lg font-medium text-[#4B3B47] bg-[#FFBCD9] hover:bg-[#FF8FC3] transition"
						to="/children"
					>
						Назад
					</Link>
				</div>

				{/* FORM */}
				<form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

					{/* FIELD BLOCK */}
					<div className="space-y-2">
						{/* OLD VALUE */}
						<p className="text-sm font-medium text-[#7A496A] bg-[#FFE6F0] px-3 py-1 rounded-lg w-fit">
							Було: <span className="font-semibold">{child?.lastName}</span>
						</p>

						<label className="font-medium text-[#4B3B47]">Прізвище</label>
						<input
							className="w-full rounded-lg border border-[#FFBCD9] bg-white/80 p-2 text-[#4B3B47]"
							type="text"
							{...register("lastName")}
						/>
						{errors.lastName && (
							<p className="text-[#C94A6A] text-sm">{errors.lastName.message}</p>
						)}
					</div>

					{/* FIRST NAME */}
					<div className="space-y-2">
						<p className="text-sm font-medium text-[#7A496A] bg-[#FFE6F0] px-3 py-1 rounded-lg w-fit">
							Було: <span className="font-semibold">{child?.firstName}</span>
						</p>

						<label className="font-medium text-[#4B3B47]">Імʼя</label>
						<input
							className="w-full rounded-lg border border-[#FFBCD9] bg-white/80 p-2 text-[#4B3B47]"
							type="text"
							{...register("firstName")}
						/>
						{errors.firstName && (
							<p className="text-[#C94A6A] text-sm">{errors.firstName.message}</p>
						)}
					</div>

					{/* PATRONYMIC */}
					<div className="space-y-2">
						<p className="text-sm font-medium text-[#7A496A] bg-[#FFE6F0] px-3 py-1 rounded-lg w-fit">
							Було: <span className="font-semibold">{child?.patronymic}</span>
						</p>

						<label className="font-medium text-[#4B3B47]">По батькові</label>
						<input
							className="w-full rounded-lg border border-[#FFBCD9] bg-white/80 p-2 text-[#4B3B47]"
							type="text"
							{...register("patronymic")}
						/>
						{errors.patronymic && (
							<p className="text-[#C94A6A] text-sm">{errors.patronymic.message}</p>
						)}
					</div>

					{/* BIRTHDAY */}
					<div className="space-y-2">
						<p className="text-sm font-medium text-[#7A496A] bg-[#FFE6F0] px-3 py-1 rounded-lg w-fit">
							Було: <span className="font-semibold">{formatDate(child!.birthdayDate)}</span>
						</p>

						<label className="font-medium text-[#4B3B47]">Дата народження</label>

						<input
							className="w-full rounded-lg border border-[#FFBCD9] bg-white/80 p-2 text-[#4B3B47]"
							type="date"
							{...register("birthdayDate")}
						/>

						{errors.birthdayDate && (
							<p className="text-[#C94A6A] text-sm">{errors.birthdayDate.message}</p>
						)}
					</div>


					{/* GROUP */}
					<div className="space-y-2">
						<p className="text-sm font-medium text-[#7A496A] bg-[#FFE6F0] px-3 py-1 rounded-lg w-fit">
							Було: <span className="font-semibold">{child?.group.name}</span>
						</p>

						<label className="font-medium text-[#4B3B47]">Група</label>
						<select
							className="w-full rounded-lg border border-[#FFBCD9] bg-white/80 p-2 text-[#4B3B47]"
							{...register("groupId")}
						>
							<option value="">Оберіть групу</option>
							{groups?.map((g) => (
								<option key={g.id} value={g.id}>
									{g.name}
								</option>
							))}
						</select>
					</div>

					{/* SUBMIT */}
					<button
						className="w-full mt-4 rounded-lg bg-[#FFBCD9] hover:bg-[#FF8FC3] text-[#4B3B47] font-semibold py-2 transition disabled:bg-[#E8C4D0]"
						disabled={isSubmitting}
						type="submit"
					>
						Зберегти зміни
					</button>
				</form>
			</div>
		</div>
	);
}

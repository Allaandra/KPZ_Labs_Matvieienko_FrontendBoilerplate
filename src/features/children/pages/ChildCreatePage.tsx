import type { ReactElement } from "react";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCreateChild } from "../api";
import { useGroups } from "../../groups/api";

// ----------------------
// ZOD SCHEMA
// ----------------------
const childCreateSchema = z.object({
	firstName: z.string().min(2, "Імʼя занадто коротке"),
	lastName: z.string().min(2, "Прізвище занадто коротке"),
	patronymic: z.string().min(2, "По батькові занадто коротке"),
	birthdayDate: z.string().min(1, "Оберіть дату народження"),
	groupId: z.coerce.number().min(1, "Оберіть групу"),
});

export type ChildCreateFormData = z.infer<typeof childCreateSchema>;

// ----------------------
// COMPONENT
// ----------------------
export function ChildCreatePage(): ReactElement {
	const createMutation = useCreateChild();
	const { data: groups, isLoading: groupsLoading } = useGroups();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm({
		resolver: zodResolver(childCreateSchema),
	});

	const onSubmit = (data: ChildCreateFormData): void => {
		createMutation.mutate({
			...data,
			groupId: Number(data.groupId),
		});
	};

	return (
		<div className="min-h-screen bg-[#D7EFFF] flex justify-center items-center p-6">

			{/* CARD */}
			<div className="w-full max-w-xl bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/40 space-y-6">

				{/* Header */}
				<div className="flex items-center justify-between mb-2">
					<h1 className="text-3xl font-bold text-[#3A506B]">
						Додати дитину
					</h1>

					<Link
						className="px-4 py-2 rounded-lg font-medium text-[#4B3B47] bg-[#FFBCD9] hover:bg-[#FF8FC3] transition"
						to="/children"
					>
						Назад
					</Link>
				</div>

				{/* FORM */}
				<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

					{/* Last Name */}
					<div>
						<label className="font-medium text-[#4B3B47]">Прізвище</label>
						<input
							className="w-full rounded-lg border border-[#FFBCD9] bg-white/80 p-2 text-[#4B3B47] focus:border-[#FF8FC3] focus:ring-2 focus:ring-[#FFBCD9] outline-none transition"
							type="text"
							{...register("lastName")}
						/>
						{errors.lastName && (
							<p className="text-[#C94A6A] text-sm">{errors.lastName.message}</p>
						)}
					</div>

					{/* First Name */}
					<div>
						<label className="font-medium text-[#4B3B47]">Імʼя</label>
						<input
							className="w-full rounded-lg border border-[#FFBCD9] bg-white/80 p-2 text-[#4B3B47] focus:border-[#FF8FC3] focus:ring-2 focus:ring-[#FFBCD9] outline-none transition"
							type="text"
							{...register("firstName")}
						/>
						{errors.firstName && (
							<p className="text-[#C94A6A] text-sm">{errors.firstName.message}</p>
						)}
					</div>

					{/* Patronymic */}
					<div>
						<label className="font-medium text-[#4B3B47]">По батькові</label>
						<input
							className="w-full rounded-lg border border-[#FFBCD9] bg-white/80 p-2 text-[#4B3B47] focus:border-[#FF8FC3] focus:ring-2 focus:ring-[#FFBCD9] outline-none transition"
							type="text"
							{...register("patronymic")}
						/>
						{errors.patronymic && (
							<p className="text-[#C94A6A] text-sm">{errors.patronymic.message}</p>
						)}
					</div>

					{/* Birthday */}
					<div>
						<label className="font-medium text-[#4B3B47]">Дата народження</label>
						<input
							className="w-full rounded-lg border border-[#FFBCD9] bg-white/80 p-2 text-[#4B3B47] focus:border-[#FF8FC3] focus:ring-2 focus:ring-[#FFBCD9] outline-none transition"
							type="date"
							{...register("birthdayDate")}
						/>
						{errors.birthdayDate && (
							<p className="text-[#C94A6A] text-sm">{errors.birthdayDate.message}</p>
						)}
					</div>

					{/* Group */}
					<div>
						<label className="font-medium text-[#4B3B47]">Група</label>

						<select
							className="w-full rounded-lg border border-[#FFBCD9] bg-white/80 p-2 text-[#4B3B47] focus:border-[#FF8FC3] focus:ring-2 focus:ring-[#FFBCD9] outline-none transition"
							{...register("groupId")}
						>
							<option value="">Оберіть групу</option>

							{groupsLoading ? (
								<option disabled>Завантаження...</option>
							) : (
								groups?.map((g) => (
									<option key={g.id} value={g.id}>
										{g.name}
									</option>
								))
							)}
						</select>

						{errors.groupId && (
							<p className="text-[#C94A6A] text-sm">{errors.groupId.message}</p>
						)}
					</div>

					{/* BUTTON */}
					<button
						className="w-full rounded-lg bg-[#FFBCD9] hover:bg-[#FF8FC3] text-[#4B3B47] font-semibold py-2 transition disabled:bg-[#E8C4D0]"
						disabled={isSubmitting || createMutation.isPending}
						type="submit"
					>
						Створити дитину
					</button>
				</form>
			</div>
		</div>
	);
}

import type { ReactElement} from "react";
// eslint-disable-next-line no-duplicate-imports
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useChildren, useDeleteChild } from "../api";
import type { ChildDTO } from "../types";
import { formatDate } from "../../../utils/formatDate";
import { useRequireAuth } from "../../auth/hooks/useRequireAuth.ts";
import { BackButton } from "../../../components/BackButton.tsx";

export function ChildrenListPage(): ReactElement {
	useRequireAuth();

	const [sortBy, setSortBy] = useState<'id' | 'lastName' | 'group' | 'birthday'>('id');

	const {
		data: children,
		isLoading,
		isError,
		error,
	} = useChildren();

	const deleteMutation = useDeleteChild();

	const handleDelete = (id: number): void => {
		if (!window.confirm("Видалити дитину?")) return;
		deleteMutation.mutate(id);
	};

	if (isLoading) return <div className="p-4">Завантаження дітей...</div>;
	if (isError)
		return (
			<div className="p-4 text-red-400">
				Помилка: {(error).message}
			</div>
		);

	const sortedChildren = [...(children ?? [])].sort((a, b) => {
		switch (sortBy) {
			case 'id':
				return a.id - b.id;

			case 'lastName':
				return a.lastName.localeCompare(b.lastName);

			case 'birthday':
				return new Date(a.birthdayDate).getTime() - new Date(b.birthdayDate).getTime();

			case 'group':
				return a.group.name.localeCompare(b.group.name);

			default:
				return 0;
		}
	});

	return (
		<div className="min-h-screen bg-[#D7EFFF] p-6 flex flex-col items-center relative">
			<BackButton />
			{/* Контейнер */}
			<div className="w-full max-w-5xl bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/40">

				{/* Верхня панель */}
				<div className="flex items-center justify-between mb-6">

					{/* Ліва частина: Заголовок + селектор */}
					<div className="flex items-center gap-4">
						<h1 className="text-3xl font-bold text-[#3A506B]">Діти</h1>

						<select
							value={sortBy}
							className="px-3 py-1 text-sm rounded-lg border border-[#FFBCD9] 
					   bg-[#FFE6F0] text-[#4B3B47] hover:bg-[#FFD3E5] 
					   transition shadow-sm"
							onChange={(e) => { setSortBy(e.target.value as any); }}
						>
							<option value="id">За ID</option>
							<option value="lastName">За прізвищем</option>
							<option value="birthday">За датою</option>
							<option value="group">За групою</option>
						</select>
					</div>

					{/* Кнопка справа */}
					<Link
						to="/children/new"
						className="px-4 py-2 rounded-lg font-medium text-[#4B3B47] 
				   bg-[#FFBCD9] hover:bg-[#FF8FC3] transition"
					>
						Додати дитину
					</Link>
				</div>

				{/* Если нет детей */}
				{(!children || children.length === 0) ? (
					<p className="text-[#6B7A8F]">Немає жодної дитини.</p>
				) : (
					<table className="w-full bg-[#FFE6F0] rounded-xl overflow-hidden border border-[#FFBCD9] shadow-sm">
						<thead className="bg-[#FFBCD9] text-[#4B3B47]">
						<tr>
							<th className="px-4 py-2 text-left">ID</th>
							<th className="px-4 py-2 text-left">ПІБ</th>
							<th className="px-4 py-2 text-left">Дата народження</th>
							<th className="px-4 py-2 text-left">Група</th>
							<th className="px-4 py-2 text-right">Дії</th>
						</tr>
						</thead>

						<tbody>
						{sortedChildren.map((child: ChildDTO) => (
							<tr
								key={child.id}
								className="border-t border-[#FFBCD9] hover:bg-[#FFD3E5] transition"
							>
								<td className="px-4 py-2">{child.id}</td>

								<td className="px-4 py-2">
									{child.lastName} {child.firstName} {child.patronymic}
								</td>

								<td className="px-4 py-2">{formatDate(child.birthdayDate)}</td>

								<td className="px-4 py-2">
									{child.group.name} (#{child.group.id})
								</td>

								<td className="px-4 py-2 text-right space-x-4">
									<Link
										className="text-[#7A496A] hover:text-[#4B3B47] underline-offset-2 hover:underline"
										params={{ childId: String(child.id) }}
										to="/children/$childId"
									>
										Редагувати
									</Link>

									<button
										className="text-[#A84A6E] hover:text-[#7A2D4F] disabled:opacity-50 underline-offset-2 hover:underline"
										disabled={deleteMutation.isPending}
										onClick={() => { handleDelete(child.id); }}
									>
										Видалити
									</button>
								</td>
							</tr>
						))}
						</tbody>
					</table>
				)}

			</div>
		</div>
	);
}

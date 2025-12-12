import type { ReactElement } from "react";
// eslint-disable-next-line no-duplicate-imports
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useGroups, useDeleteGroup } from "../api";
import type { GroupDTO } from "../types";
import { useRequireAuth } from "../../auth/hooks/useRequireAuth";
import { BackButton } from "../../../components/BackButton";

export function GroupsListPage(): ReactElement {
	useRequireAuth();

	const [sortBy, setSortBy] = useState<"id" | "name">("id");

	const {
		data: groups,
		isLoading,
		isError,
		error,
	} = useGroups();

	const deleteMutation = useDeleteGroup();

	const handleDelete = (group: GroupDTO): void => {
		if (!window.confirm(`Видалити групу "${group.name}"?`)) return;

		if (group.childCount > 0) {
			alert(`Не можна видалити групу. У групі є ${group.childCount} дітей.`);
			return;
		}

		deleteMutation.mutate(group.id);
	};

	if (isLoading) return <div className="p-4">Завантаження груп...</div>;

	if (isError)
		return (
			<div className="p-4 text-red-400">
				Помилка: {(error).message}
			</div>
		);

	// ⭐ СОРТИРОВКА
	const sortedGroups = [...(groups ?? [])].sort((a, b) => {
		switch (sortBy) {
			case "id":
				return a.id - b.id;
			case "name":
				return a.name.localeCompare(b.name);
			default:
				return 0;
		}
	});

	return (
		<div className="min-h-screen bg-[#D7EFFF] p-6 flex flex-col items-center relative">
			<BackButton />

			{/* Контейнер */}
			<div className="w-full max-w-5xl bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/40">

				{/* Верхняя панель */}
				<div className="flex items-center justify-between mb-6">

					{/* Левая часть: заголовок + сортировка */}
					<div className="flex items-center gap-4">
						<h1 className="text-3xl font-bold text-[#3A506B]">Групи</h1>

						<select
							value={sortBy}
							className="px-3 py-1 text-sm rounded-lg border border-[#FFBCD9]
							   bg-[#FFE6F0] text-[#4B3B47] hover:bg-[#FFD3E5]
							   transition shadow-sm"
							onChange={(e) => { setSortBy(e.target.value as any); }}
						>
							<option value="id">За ID</option>
							<option value="name">За назвою</option>
						</select>
					</div>

					{/* Кнопка справа */}
					<Link
						to="/groups/new"
						className="px-4 py-2 rounded-lg font-medium text-[#4B3B47]
						   bg-[#FFBCD9] hover:bg-[#FF8FC3] transition"
					>
						Додати групу
					</Link>
				</div>

				{/* Таблица */}
				{(!groups || groups.length === 0) ? (
					<p className="text-[#6B7A8F]">Поки що немає жодної групи.</p>
				) : (
					<table className="w-full bg-[#FFE6F0] rounded-xl overflow-hidden border border-[#FFBCD9] shadow-sm">
						<thead className="bg-[#FFBCD9] text-[#4B3B47]">
						<tr>
							<th className="px-4 py-2 text-left">ID</th>
							<th className="px-4 py-2 text-left">Назва</th>
							<th className="px-4 py-2 text-left">Кількість дітей</th>
							<th className="px-4 py-2 text-right">Дії</th>
						</tr>
						</thead>

						<tbody>
						{sortedGroups.map((group) => (
							<tr
								key={group.id}
								className="border-t border-[#FFBCD9] hover:bg-[#FFD3E5] transition"
							>
								<td className="px-4 py-2">{group.id}</td>
								<td className="px-4 py-2">{group.name}</td>
								<td className="px-4 py-2">{group.childCount}</td>

								<td className="px-4 py-2 text-right space-x-4">
									<Link
										className="text-[#7A496A] hover:text-[#4B3B47] underline-offset-2 hover:underline"
										params={{ groupId: String(group.id) }}
										to="/groups/$groupId"
									>
										Редагувати
									</Link>

									<button
										className="text-[#A84A6E] hover:text-[#7A2D4F] underline-offset-2 hover:underline disabled:opacity-50"
										disabled={deleteMutation.isPending}
										onClick={() => { handleDelete(group); }}
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

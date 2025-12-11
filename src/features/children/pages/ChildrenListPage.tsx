import type { ReactElement } from "react";
import { Link } from "@tanstack/react-router";
import { useChildren, useDeleteChild } from "../api";
import type { ChildDTO } from "../types";
import { formatDate } from "../../../utils/formatDate";
import { useRequireAuth } from "../../auth/hooks/useRequireAuth.ts";

export function ChildrenListPage(): ReactElement {
	useRequireAuth();

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

	return (
		<div className="min-h-screen bg-[#D7EFFF] p-6 flex flex-col items-center">
			{/* Контейнер */}
			<div className="w-full max-w-5xl bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/40">

				{/* Верхняя панель */}
				<div className="flex items-center justify-between mb-4">
					<h1 className="text-3xl font-bold text-[#3A506B]">Діти</h1>

					<Link
						className="px-4 py-2 rounded-lg font-medium text-[#4B3B47] bg-[#FFBCD9] hover:bg-[#FF8FC3] transition"
						to="/children/new"
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
						{children.map((child: ChildDTO) => (
							<tr
								key={child.id}
								className="border-t border-[#FFBCD9] hover:bg-[#FFD3E5] transition"
							>
								<td className="px-4 py-2">{child.id}</td>

								<td className="px-4 py-2">
									{child.lastName} {child.firstName} {child.patronymic}
								</td>

								<td className="px-4 py-2">{formatDate(child.birthdayDate)}
								</td>

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

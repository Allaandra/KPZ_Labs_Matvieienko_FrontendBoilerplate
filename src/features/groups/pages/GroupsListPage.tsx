import type { ReactElement } from "react";
import { Link } from "@tanstack/react-router";

import { useGroups, useDeleteGroup } from "../api";
import type { GroupDTO } from "../types";

export function GroupsListPage(): ReactElement {
	const {
		data: groups,
		isLoading,
		isError,
		error,
	} = useGroups();

	const deleteMutation = useDeleteGroup();

	const handleDelete = (id: number): void => {
		if (!window.confirm("Видалити цю групу?")) return;
		deleteMutation.mutate(id);
	};

	if (isLoading) {
		return <div className="p-4">Завантаження груп...</div>;
	}

	if (isError) {
		return (
			<div className="p-4 text-red-400">
				Помилка завантаження: {(error as Error).message}
			</div>
		);
	}

	return (
		<div className="p-6 space-y-4">
			{/* Заголовок + кнопка створення */}
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Групи</h1>

				<Link
					className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
					to="/groups/new"
				>
					Додати групу
				</Link>
			</div>

			{(!groups || groups.length === 0) ? (
				<p className="text-gray-400">Поки що немає жодної групи.</p>
			) : (
				<table className="min-w-full overflow-hidden rounded border border-slate-700 bg-slate-900">
					<thead className="bg-slate-800">
					<tr>
						<th className="px-4 py-2 text-left">ID</th>
						<th className="px-4 py-2 text-left">Назва</th>
						<th className="px-4 py-2 text-left">Кількість дітей</th>
						<th className="px-4 py-2 text-right">Дії</th>
					</tr>
					</thead>
					<tbody>
					{groups.map((group: GroupDTO) => (
						<tr key={group.id} className="border-t border-slate-700">
							<td className="px-4 py-2">{group.id}</td>
							<td className="px-4 py-2">{group.name}</td>
							<td className="px-4 py-2">{group.childCount}</td>
							<td className="space-x-3 px-4 py-2 text-right">
								<Link
									className="text-indigo-400 hover:text-indigo-200"
									params={{ groupId: String(group.id) }}
									to="/groups/$groupId"
								>
									Редагувати
								</Link>

								<button
									className="text-red-400 hover:text-red-200 disabled:opacity-50"
									disabled={deleteMutation.isPending}
									type="button"
									onClick={() => handleDelete(group.id)}
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
	);
}

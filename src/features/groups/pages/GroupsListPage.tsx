import type { ReactElement } from "react";
import { Link } from "@tanstack/react-router";
import { useRequireAuth } from "../../auth/hooks/useRequireAuth";
import { useGroups, useDeleteGroup } from "../api";
import type { GroupDTO } from "../types";

export function GroupsListPage(): ReactElement {
	useRequireAuth();

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


	if (isLoading) {
		return <div className="p-4">Завантаження груп...</div>;
	}

	if (isError) {
		return (
			<div className="p-4 text-red-400">
				Помилка завантаження: {(error).message}
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#D7EFFF] flex justify-center items-start p-6">

			{/* CARD */}
			<div className="w-full max-w-5xl bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/40 space-y-4">

				{/* Header */}
				<div className="flex items-center justify-between">
					<h1 className="text-3xl font-bold text-[#3A506B]">Групи</h1>

					<Link
						className="px-4 py-2 rounded-lg font-medium text-[#4B3B47] bg-[#FFBCD9] hover:bg-[#FF8FC3] transition"
						to="/groups/new"
					>
						Додати групу
					</Link>
				</div>

				{/* Empty message */}
				{(!groups || groups.length === 0) ? (
					<p className="text-[#6B7A8F]">Поки що немає жодної групи.</p>
				) : (
					<table className="w-full bg-[#FFE6F0] rounded-xl overflow-hidden border border-[#FFBCD9] shadow">
						<thead className="bg-[#FFBCD9] text-[#4B3B47]">
						<tr>
							<th className="px-4 py-2 text-left">ID</th>
							<th className="px-4 py-2 text-left">Назва</th>
							<th className="px-4 py-2 text-left">Кількість дітей</th>
							<th className="px-4 py-2 text-right">Дії</th>
						</tr>
						</thead>

						<tbody>
						{groups.map((group: GroupDTO) => (
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
										className="text-[#A84A6E] hover:text-[#7A2D4F] disabled:opacity-50 underline-offset-2 hover:underline"
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

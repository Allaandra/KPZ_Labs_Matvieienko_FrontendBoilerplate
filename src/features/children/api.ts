/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import apiClient from "../../lib/axios";
import type { ChildDTO, CreateChildDTO } from "./types";

// ================= API =================

const getChildren = async (): Promise<ChildDTO[]> => {
	const res = await apiClient.get("/children");
	return res.data;
};

const getChild = async (id: number): Promise<ChildDTO> => {
	const res = await apiClient.get(`/children/${id}`);
	return res.data;
};

const createChild = async (data: CreateChildDTO): Promise<ChildDTO> => {
	const res = await apiClient.post("/children", data);
	return res.data;
};

const updateChild = async (
	id: number,
	data: CreateChildDTO
): Promise<ChildDTO> => {
	const res = await apiClient.put(`/children/${id}`, data);
	return res.data;
};

const deleteChild = async (id: number): Promise<void> => {
	await apiClient.delete(`/children/${id}`);
};

// ================= HOOKS =================

export const useChildren = () =>
	useQuery({
		queryKey: ["children"],
		queryFn: getChildren,
	});

export const useChild = (id: number) =>
	useQuery({
		queryKey: ["children", id],
		queryFn: () => getChild(id),
		enabled: !!id,
	});

export const useCreateChild = () => {
	const qc = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: createChild,
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["children"] });
			navigate({ to: "/children" });
		},
	});
};

export const useUpdateChild = () => {
	const qc = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: ({
									 id,
									 data,
								 }: {
			id: number;
			data: CreateChildDTO;
		}) => updateChild(id, data),

		onSuccess: (updatedChild) => {
			// Обновляем список
			qc.invalidateQueries({ queryKey: ["children"] });

			// Обновляем конкретного ребёнка
			qc.setQueryData(["children", updatedChild.id], updatedChild);

			navigate({ to: "/children" });
		},
	});
};

export const useDeleteChild = () => {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: deleteChild,
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["children"] });
		},
	});
};

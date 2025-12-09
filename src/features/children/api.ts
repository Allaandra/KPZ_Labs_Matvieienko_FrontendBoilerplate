import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../lib/axios";
import type { ChildDTO, CreateChildDTO } from "./types";


const getChildren = async (): Promise<Array<ChildDTO>> => {
	const res = await apiClient.get("/children");
	return res.data;
};

const getChild = async (id: number): Promise<ChildDTO> => {
	const res = await apiClient.get(`/children/${id}`);
	return res.data;
};

const createChild = async (data: CreateChildDTO) => {
	const res = await apiClient.post("/children", data);
	return res.data;
};

const updateChild = async (id: number, data: CreateChildDTO) => {
	const res = await apiClient.put(`/children/${id}`, data);
	return res.data;
};

const deleteChild = async (id: number) => {
	await apiClient.delete(`/children/${id}`);
};

// ======== HOOKS ========

export const useChildren = () =>
	useQuery({ queryKey: ["children"], queryFn: getChildren });

export const useChild = (id: number) =>
	useQuery({ queryKey: ["children", id], queryFn: () => getChild(id) });

export const useCreateChild = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: createChild,
		onSuccess: () => qc.invalidateQueries({ queryKey: ["children"] }),
	});
};

export const useUpdateChild = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: number; data: CreateChildDTO }) =>
			updateChild(id, data),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["children"] }),
	});
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
export const useDeleteChild = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: deleteChild,
		onSuccess: () => qc.invalidateQueries({ queryKey: ["children"] }),
	});
};

/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../lib/axios";
import type { GroupDTO, CreateGroupDTO } from "./types";
import { useNavigate } from "@tanstack/react-router";

// ================= API =================

const getGroups = async (): Promise<Array<GroupDTO>> => {
	const res = await apiClient.get("/groups");
	return res.data;
};

const getGroup = async (id: number): Promise<GroupDTO> => {
	const res = await apiClient.get(`/groups/${id}`);
	return res.data;
};

const createGroup = async (data: CreateGroupDTO) => {
	const res = await apiClient.post("/groups", data);
	return res.data;
};

const updateGroup = async (id: number, data: CreateGroupDTO) => {
	const res = await apiClient.put(`/groups/${id}`, data);
	return res.data;
};

const deleteGroup = async (id: number) => {
	await apiClient.delete(`/groups/${id}`);
};

// ================== HOOKS ==================

export const useGroups = () =>
	useQuery({
		queryKey: ["groups"],
		queryFn: getGroups,
	});

export const useGroup = (id: number) =>
	useQuery({
		queryKey: ["groups", id],
		queryFn: () => getGroup(id)
	});

export const useCreateGroup = () => {
	const qc = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: (data: CreateGroupDTO) => createGroup(data),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["groups"] });
			navigate({ to: "/groups" });
		},
	});
};

export const useUpdateGroup = () => {
	const qc = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: ({ id, data }: { id: number; data: CreateGroupDTO }) =>
			updateGroup(id, data),

		onSuccess: (_, variables) => {
			qc.invalidateQueries({ queryKey: ["groups"] });
			qc.invalidateQueries({ queryKey: ["groups", variables.id] });
			navigate({ to: "/groups" });
		},
	});
};

export const useDeleteGroup = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: deleteGroup,
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["groups"] });
		},
	});
};

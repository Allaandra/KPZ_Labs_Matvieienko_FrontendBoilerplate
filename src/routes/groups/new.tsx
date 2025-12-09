import { createFileRoute } from "@tanstack/react-router";
import { GroupCreatePage } from "../../features/groups/pages/GroupCreatePage";

export const Route = createFileRoute("/groups/new")({
	component: GroupCreatePage,
});

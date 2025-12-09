import { createFileRoute } from "@tanstack/react-router";
import { GroupEditPage } from "../../features/groups/pages/GroupEditPage";

export const Route = createFileRoute("/groups/$groupId")({
	component: GroupEditPage,
});

import { createFileRoute } from "@tanstack/react-router";
import { GroupsListPage } from '../../features/groups/pages/GroupsListPage';

export const Route = createFileRoute("/groups/")({
	component: GroupsListPage,
});

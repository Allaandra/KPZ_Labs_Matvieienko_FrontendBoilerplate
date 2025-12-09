import { createFileRoute } from "@tanstack/react-router";
import { ChildrenListPage } from "../../features/children/pages/ChildrenListPage";

export const Route = createFileRoute("/children/")({
	component: ChildrenListPage,
});

import { createFileRoute } from "@tanstack/react-router";
import { ChildCreatePage } from "../../features/children/pages/ChildCreatePage";

export const Route = createFileRoute("/children/new")({
	component: ChildCreatePage,
});

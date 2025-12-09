import { createFileRoute } from "@tanstack/react-router";
import { ChildEditPage } from "../../features/children/pages/ChildEditPage";

export const Route = createFileRoute("/children/$childId")({
	component: ChildEditPage,
});

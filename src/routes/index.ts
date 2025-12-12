import { createFileRoute } from "@tanstack/react-router";
import { Home } from "../pages/Home";
//import { LoginPage } from "../features/auth/pages/LoginPage.tsx";

export const Route = createFileRoute("/")({
	component: Home,
});

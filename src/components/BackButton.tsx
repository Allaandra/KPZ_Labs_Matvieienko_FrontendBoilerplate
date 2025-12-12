import { Link } from "@tanstack/react-router";

export function BackButton() {
	return (
		<div className="absolute left-8 top-8 z-50">
			<Link
				to="/"
				className="
					px-5 py-2
					rounded-lg
					bg-[#A5D8FF]
					text-[#1E3A5F]
					hover:bg-[#8FCBFF]
					transition
					font-medium
					shadow-md
				"
			>
				⬅ Назад
			</Link>
		</div>
	);
}

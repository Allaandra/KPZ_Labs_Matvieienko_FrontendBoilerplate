/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
			colors: {
				babyblue: {
					bg: "#D7EFFF",
				},
				babypink: {
					light: "#FFE6F0",
					medium: "#FFBCD9",
					hover: "#FFD3E5",
				}
			}
		},
  },
  plugins: [],
};

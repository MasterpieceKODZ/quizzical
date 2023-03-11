/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
	content: ["./pages/**/*.tsx", "./components/*.tsx"],
	theme: {
		extend: {
			screens: {
				mobileM: "320px",
				mobileL: "360px",
				mobileXL: "400px",
				tabS: "424px",
				tabM: "525px",
				tabL: "625px",
				laptopS: "750px",
				laptopM: "1024px",
				laptopL: "1400px",
				tv: "2500px",
				short: { raw: "(min-height: 470px)" },
				tallXS: { raw: "(min-height: 500px)" },
				tallS: { raw: "(min-height: 600px)" },
				tall: { raw: "(min-height: 700px)" },
				tallL: { raw: "(min-height: 750px)" },
			},
			colors: {
				primary: "#191970ff",
				secondary: "#ffdd00fe",
				accent: colors.emerald["400"],
				correct: colors.lime["300"],
				wrong: colors.red["400"],
			},
			fontFamily: {
				julee: "Julee, cursive",
				stylish: '"Stylish", sans-serif',
				newRocker: '"New Rocker", cursive',
				specialElite: '"Special Elite", cursive',
				wallpoet: '"Wallpoet", cursive',
			},
		},
		plugins: [],
	},
};

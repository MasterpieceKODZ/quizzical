/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
	content: ["./pages/**/*.tsx"],
	theme: {
		colors: {
			primary: "#191970ff",
			secondary: "#ffdd00fe",
			accent: colors.emerald["400"],
			correct: colors.lime["300"],
			wrong: colors.red["400"],
		},
		screens: {
			mobileM: "320px",
			mobileL: "375px",
			tabS: "425px",
			tabM: "525px",
			tabL: "625px",
			laptopS: "750px",
			laptopM: "1024px",
			laptopL: "1400px",
			tv: "2500px",
		},
		extend: {
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

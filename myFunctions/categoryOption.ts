import { Dispatch, SetStateAction } from "react";
export async function selectQuestionCategory(
	e: any,
	setState: Dispatch<SetStateAction<string>>,
) {
	const categoryOption = document.querySelector(".category-active");

	categoryOption?.classList.remove("category-active");

	e.target.classList.add("category-active");

	const categoryText: string = e.target.textContent;
	const catQrTx = categoryText
		.toLowerCase()
		.trim()
		.split(" ")
		.join("_")
		.replaceAll("&", "and");

	setState(catQrTx);
}

export async function selectQuestionDifficulty(
	e: any,
	setState: Dispatch<SetStateAction<string>>,
) {
	const difficultyOption = document.querySelector(".difficulty-active");

	difficultyOption?.classList.remove("difficulty-active");

	e.target.classList.add("difficulty-active");
	const diffQrTx: string = e.target.textContent;

	setState(diffQrTx.toLowerCase());
}

export async function optionFocused(e: any) {
	e.target.classList.add("open");
}

export async function optionBlurred(t: string) {
	const option = document.getElementById(`${t}-option-host`);
	option?.classList.remove("open");
}

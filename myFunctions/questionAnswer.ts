import { Dispatch, SetStateAction } from "react";

export async function selectAnswer(e: any) {
	const prevAnswer = document.querySelector(".active-option");
	prevAnswer?.classList.remove("active-option");

	e.target.classList.add("active-option");

	window.sessionStorage.setItem("optionSelected", e.target.textContent);
}

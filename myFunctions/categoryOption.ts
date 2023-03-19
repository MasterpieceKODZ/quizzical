export async function selectQuestionCategory(e: any) {
	const categoryOption = document.querySelector(".category-active");
	console.log(categoryOption?.textContent);

	categoryOption?.classList.remove("category-active");

	e.target.classList.add("category-active");
}

export async function selectQuestionDifficulty(e: any) {
	const difficultyOption = document.querySelector(".difficulty-active");
	console.log(difficultyOption?.textContent);

	difficultyOption?.classList.remove("difficulty-active");

	e.target.classList.add("difficulty-active");
}

export async function optionFocused(e: any) {
	e.target.classList.add("open");
}

export async function optionBlurred(t: string) {
	const option = document.getElementById(`${t}-option-host`);
	option?.classList.remove("open");
}

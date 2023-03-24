export async function showLoadingSpinner() {
	const spinner = document.getElementById("login-spinner");
	spinner?.classList.remove("hidden");
	spinner?.classList.add("flex");
}

export async function hideLoadingSpinner() {
	const spinner = document.getElementById("login-spinner");
	spinner?.classList.remove("flex");
	spinner?.classList.add("hidden");
}

export async function hideQuizroomLoadingSpinner() {
	const spinner = document.getElementById("quizroom-loading-spinner");
	spinner?.classList.remove("flex");
	spinner?.classList.add("hidden");
}

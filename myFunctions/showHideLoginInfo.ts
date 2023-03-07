export async function showInfoLogin(info: string) {
	const emailErrorTag = document.getElementById("email-error-login");
	emailErrorTag?.classList.add("hidden");
	const passwordCheckTag = document.getElementById("password-check-login");
	passwordCheckTag?.classList.add("hidden");
	const errorConsole: any = document.getElementById("login-error-console");
	errorConsole.classList.remove("hidden");
	errorConsole.textContent = info;
}

export async function hideInfoLogin() {
	const errorConsole: any = document.getElementById("login-error-console");
	errorConsole.classList.add("hidden");
}

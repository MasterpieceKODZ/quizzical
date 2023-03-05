export async function showInfoLogin(info: string) {
	const errorConsole: any = document.getElementById("login-error-console");
	errorConsole.classList.remove("hidden");
	errorConsole.textContent = info;
}

export async function hideInfoLogin() {
	const errorConsole: any = document.getElementById("login-error-console");
	errorConsole.classList.add("hidden");
}

export async function showFormInfo(info: string, action: string) {
	const emailErrorTag = document.getElementById(`email-error-${action}`);
	emailErrorTag?.classList.add("hidden");
	const passwordCheckTag = document.getElementById(`password-check-${action}`);
	passwordCheckTag?.classList.add("hidden");
	const errorConsole: any = document.getElementById(`${action}-error-console`);
	errorConsole.classList.remove("hidden");
	errorConsole.textContent = info;
}

export async function hideFormInfo(action: string) {
	const errorConsole: any = document.getElementById(`${action}-error-console`);
	errorConsole.classList.add("hidden");
}

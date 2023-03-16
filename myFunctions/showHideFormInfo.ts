export async function showFormInfo(info: string, action: string, type: string) {
	hideFormInfo(action);
	const emailErrorTag = document.getElementById(`email-error-${action}`);
	emailErrorTag?.classList.add("hidden");
	const passwordCheckTag = document.getElementById(`password-check-${action}`);
	passwordCheckTag?.classList.add("hidden");
	const errorConsole: any = document.getElementById(`${action}-error-console`);
	errorConsole.classList.remove("hidden");
	if (type == "error") {
		errorConsole.classList.remove("feedback-success");
		errorConsole.classList.remove("feedback-info");
		errorConsole.classList.add("feedback-error");
	} else if (type == "success") {
		errorConsole.classList.remove("feedback-info");
		errorConsole.classList.remove("feedback-error");
		errorConsole.classList.add("feedback-success");
	} else {
		errorConsole.classList.remove("feedback-error");
		errorConsole.classList.remove("feedback-success");
		errorConsole.classList.add("feedback-info");
	}
	errorConsole.textContent = info;
}

export async function hideFormInfo(action: string) {
	const errorConsole: any = document.getElementById(`${action}-error-console`);
	errorConsole.textContent = "";
	errorConsole.classList.remove("feedback-error");
	errorConsole.classList.remove("feedback-success");
	errorConsole.classList.remove("feedback-info");
	errorConsole.classList.add("hidden");
}

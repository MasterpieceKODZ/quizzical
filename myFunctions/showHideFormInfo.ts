export async function showFormInfo(info: string, action: string, type: string) {
	const emailErrorTag = document.getElementById(`email-error-${action}`);
	emailErrorTag?.classList.add("hidden");
	const passwordCheckTag = document.getElementById(`password-check-${action}`);
	passwordCheckTag?.classList.add("hidden");
	const errorConsole: any = document.getElementById(`${action}-error-console`);
	errorConsole.classList.remove("hidden");
	if (type == "error") {
		errorConsole.classList.remove(
			"ring-lime-400",
			"bg-lime-200",
			"text-lime-600",
			"ring-stone-500",
			"bg-stone-400",
			"text-stone-700",
		);
		errorConsole.classList.add("ring-red-400", "bg-red-200", "text-red-600");
	} else if (type == "info") {
		errorConsole.classList.remove(
			"ring-red-400",
			"bg-red-200",
			"text-red-600",
			"ring-stone-500",
			"bg-stone-400",
			"text-stone-700",
		);
		errorConsole.classList.add("ring-lime-400", "bg-lime-200", "text-lime-600");
	} else {
		errorConsole.classList.remove(
			"ring-red-400",
			"bg-red-200",
			"text-red-600",
			"ring-lime-500",
			"bg-lime-400",
			"text-lime-700",
		);
		errorConsole.classList.add(
			"ring-stone-500",
			"bg-stone-400",
			"text-stone-700",
		);
	}
	errorConsole.textContent = info;
}

export async function hideFormInfo(action: string) {
	const errorConsole: any = document.getElementById(`${action}-error-console`);
	errorConsole.textContent = "";
	errorConsole.classList.remove(
		"ring-red-400",
		"bg-red-200",
		"text-red-600",
		"ring-lime-400",
		"bg-lime-200",
		"text-lime-600",
		"ring-stone-500",
		"bg-stone-400",
		"text-stone-700",
	);
	errorConsole.classList.add("hidden");
}

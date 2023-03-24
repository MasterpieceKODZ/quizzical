export async function openInfoModal(title: string, body: string, type: string) {
	const modal = document.getElementById("info-modal");
	modal?.classList.remove("hidden");
	modal?.classList.add("flex");
	if (type == "info") {
		modal?.classList.remove("text-red-500");
		modal?.classList.add("text-green-500");
	} else if ("error") {
		modal?.classList.remove("text-green-500");
		modal?.classList.add("text-red-500");
	}
	const infoTitle: any = document.getElementById("quizroom-info-modal-title");
	infoTitle.textContent = title;
	const infoBody: any = document.getElementById("quizroom-info-modal-body");
	infoBody.textContent = body;

	const btnRestart = document.getElementById("btn-restart");
	if (title) {
		btnRestart?.classList.remove("hidden");
	} else {
		btnRestart?.classList.add("hidden");
	}
}

export async function closeInfoModal() {
	const infoTitle: any = document.getElementById("quizroom-info-modal-title");
	infoTitle.textContent = "";
	const infoBody: any = document.getElementById("quizroom-info-modal-body");
	infoBody.textContent = "";
	const modal = document.getElementById("info-modal");
	modal?.classList.remove("flex");
	modal?.classList.add("hidden");
}

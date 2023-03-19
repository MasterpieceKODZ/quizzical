export async function showLeaderBoard(e: any) {
	e.target.parentElement.classList.add("open");
}

export async function hideLeaderBoard() {
	const leaderboard = document.getElementById("leaderboard-host");
	leaderboard?.classList.remove("open");
}

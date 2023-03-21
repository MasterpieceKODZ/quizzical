export async function showLeaderBoard(e: any) {
	e.target.parentElement.classList.add("open");
}

export async function hideLeaderBoard() {
	const leaderboard = document.getElementById("leaderboard-host");
	leaderboard?.classList.remove("open");
}

export async function displayLeaderboard(e: any) {
	const leaderboard = document.getElementById("leaderboard-host");
	if (leaderboard?.classList.contains("open")) {
		leaderboard.classList.remove("open");
	} else {
		leaderboard?.classList.add("open");
	}
}

export async function showHidePassword(e: any, action: string) {
	const isClosed: any = e.target.classList.contains("fa-eye");
	const passwordStatus: any = document.getElementById(
		`${action}-password-status`,
	);

	if (isClosed) {
		e.target.previousSibling.type = "text";
		e.target.classList.remove("fa-eye");
		e.target.classList.add("fa-eye-slash");
		passwordStatus.textContent = "Your password is visible";
	} else {
		e.target.previousSibling.type = "password";
		e.target.classList.remove("fa-eye-slash");
		e.target.classList.add("fa-eye");
		passwordStatus.textContent = "Your password is hidden";
	}
}

// update the password requirement text for screen readers
export async function passwordFocusAssist(action: string) {
	const passReq: any = document.getElementById(`${action}-password-req`);
	const passAssText = passReq?.textContent;
	if (passAssText) {
		passReq.textContent = "";
	} else {
		passReq.textContent =
			"minimum password requirement is, at least six letters, one number and one non-alphanumeric character";
	}
}

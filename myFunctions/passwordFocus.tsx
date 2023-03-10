export async function passwordIsFocused(e: any) {
	e.target.parentElement.classList.remove("ring-slate-600");
	e.target.parentElement.classList.add("ring-white");
	e.target.parentElement.classList.add("border-accent");
}

export async function passwordIsBlur(e: any) {
	e.target.parentElement.classList.remove("ring-white");
	e.target.parentElement.classList.add("ring-slate-600");
	e.target.parentElement.classList.remove("border-accent");
}

export async function showHidePassword(e: any) {
	const isClosed: any = e.target.classList.contains("fa-eye");

	if (isClosed) {
		e.target.previousSibling.type = "text";
		e.target.classList.remove("fa-eye");
		e.target.classList.add("fa-eye-slash");
	} else {
		e.target.previousSibling.type = "password";
		e.target.classList.remove("fa-eye-slash");
		e.target.classList.add("fa-eye");
	}
}

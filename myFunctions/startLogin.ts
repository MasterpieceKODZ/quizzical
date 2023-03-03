import { loginEmailValidation } from "./validateEmailAddresses";
import { validatePasswordOnSubmit } from "./validatePassword";

export default async function initiateLoginProcess() {
	const spinner = document.getElementById("login-spinner");
	spinner?.classList.remove("hidden");
	spinner?.classList.add("flex");

	const emailInput: any = document.getElementById("inp-email-login");
	const passwordInput: any = document.getElementById("inp-password-login");

	const emailErrorTag: any = document.getElementById("email-error-login");
	emailErrorTag.classList.add("hidden");
	const passwordErrorTag: any = document.getElementById("password-error-login");

	const emailValue = emailInput.value.trim();

	// validate email address
	let emailIsvalid = false;

	await loginEmailValidation(emailValue).then((res: any) => {
		if (res.emailState == "VALID") {
			emailIsvalid = true;
		} else if (res.emailState == "TYPO") {
			emailIsvalid = false;
			spinner?.classList.remove("flex");
			spinner?.classList.add("hidden");
			emailErrorTag.textContent = `incorrect email, did you mean: ${res.autocorrect}`;
			emailErrorTag.classList.remove("hidden");
		} else if (res.emailState == "INVALID") {
			emailIsvalid = false;
			spinner?.classList.remove("flex");
			spinner?.classList.add("hidden");
			emailErrorTag.textContent = `invalid email please enter a valid email address and try again`;
			emailErrorTag.classList.remove("hidden");
		} else if (res.emailState == "CATCH_ALL") {
			emailIsvalid = false;
			spinner?.classList.remove("flex");
			spinner?.classList.add("hidden");
			emailErrorTag.textContent = `catch all emails are not valid use a different email address and try again.`;
			emailErrorTag.classList.remove("hidden");
		} else if (res.emailState == "ROLE") {
			emailIsvalid = false;
			spinner?.classList.remove("flex");
			spinner?.classList.add("hidden");
			emailErrorTag.textContent = `role emails are not valid use a different email and try again.`;
			emailErrorTag.classList.remove("hidden");
		}
	});

	const passwordIsValid = validatePasswordOnSubmit();

	console.log(
		"email is valid ",
		emailIsvalid,
		" password is valid ",
		passwordIsValid,
	);

	spinner?.classList.remove("flex");
	spinner?.classList.add("hidden");
}

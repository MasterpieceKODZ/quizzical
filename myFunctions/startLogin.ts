import { hideLoadingSpinner, showLoadingSpinner } from "./showHideSpinner";
import loginUserAccount from "./userLogin";
import signUpNewUser from "./userSignUp";
import { loginEmailValidation } from "./validateEmailAddresses";
import { validatePasswordOnSubmit } from "./validatePassword";

export default async function initiateLoginProcess() {
	showLoadingSpinner();

	const emailInput: any = document.getElementById("inp-email-login");
	const passwordInput: any = document.getElementById("inp-password-login");

	const emailErrorTag: any = document.getElementById("email-error-login");
	emailErrorTag.classList.add("hidden");

	const emailValue = emailInput.value.trim();

	// validate email address
	let emailIsValid = false;

	await loginEmailValidation(emailValue).then((res: any) => {
		if (res.emailState == "VALID") {
			emailIsValid = true;
		} else if (res.emailState == "TYPO") {
			emailIsValid = false;
			hideLoadingSpinner();
			emailErrorTag.textContent = `incorrect email, did you mean: ${res.autocorrect}`;
			emailErrorTag.classList.remove("hidden");
		} else if (res.emailState == "INVALID") {
			emailIsValid = false;
			hideLoadingSpinner();
			emailErrorTag.textContent = `invalid email please enter a valid email address and try again`;
			emailErrorTag.classList.remove("hidden");
		} else if (res.emailState == "CATCH_ALL") {
			emailIsValid = false;
			hideLoadingSpinner();
			emailErrorTag.textContent = `catch all emails are not valid use a different email address and try again.`;
			emailErrorTag.classList.remove("hidden");
		} else if (res.emailState == "ROLE") {
			emailIsValid = false;
			hideLoadingSpinner();
			emailErrorTag.textContent = `role emails are not valid use a different email and try again.`;
			emailErrorTag.classList.remove("hidden");
		}
	});

	const passwordIsValid = validatePasswordOnSubmit();

	if (emailIsValid && passwordIsValid) {
		//signUpNewUser(emailValue, passwordInput.value.trim());
		loginUserAccount(emailValue, passwordInput.value.trim());
	}

	hideLoadingSpinner();
}

import { hideInfoLogin, showInfoLogin } from "./showHideLoginInfo";
import { hideLoadingSpinner, showLoadingSpinner } from "./showHideSpinner";
import loginUserAccount from "./userLogin";
import signUpNewUser from "./userSignUp";
import {
	getEmailValidationResponse,
	validateEmailInputed,
} from "./validateEmailAddresses";
import { validatePasswordOnSubmit } from "./validatePassword";

export default async function initiateLoginProcess() {
	showLoadingSpinner();

	const emailInput: any = document.getElementById("inp-email-login");
	const passwordInput: any = document.getElementById("inp-password-login");

	const emailErrorTag: any = document.getElementById("email-error-login");
	emailErrorTag.classList.add("hidden");

	const emailValue = emailInput.value.trim();

	// validate email address
	let emailIsValid: any;

	await getEmailValidationResponse(emailValue).then((res) => {
		emailIsValid = res;
	});

	const passwordIsValid = validatePasswordOnSubmit("login");

	if (emailIsValid && passwordIsValid) {
		//signUpNewUser(emailValue, passwordInput.value.trim());
		loginUserAccount(emailValue, passwordInput.value.trim());
	}

	hideLoadingSpinner();
}

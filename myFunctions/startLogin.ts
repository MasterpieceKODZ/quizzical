import { hideFormInfo, showFormInfo } from "./showHideFormInfo";
import { hideLoadingSpinner, showLoadingSpinner } from "./showHideSpinner";
import loginUserAccount from "./userLogin";
import { validatePasswordOnSubmit } from "./validatePassword";
import { NextRouter } from "next/router";

export default async function initiateLoginProcess(router: NextRouter) {
	showLoadingSpinner();

	const emailInput: any = document.getElementById("inp-email-login");
	const passwordInput: any = document.getElementById("inp-password-login");
	// set password input type back to password to prevent the form from remebering the input value if user submits the form while password is visible
	passwordInput.type = "password";

	const emailValue = emailInput.value.trim();

	const passwordIsValid = validatePasswordOnSubmit("login");

	if (passwordIsValid) {
		loginUserAccount(emailValue, passwordInput.value.trim(), router);
	} else {
		showFormInfo(
			"Your password does not pass the minimum password requirements, change password and try again.",
			"login",
			"error",
		);
		setTimeout(() => {
			hideFormInfo("login");
		}, 6000);
	}

	hideLoadingSpinner();
}

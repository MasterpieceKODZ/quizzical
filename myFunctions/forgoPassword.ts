import { appAuth } from "@/firebase.config";
import { sendPasswordResetEmail } from "firebase/auth";
import { hideInfoLogin, showInfoLogin } from "./showHideLoginInfo";
import { getEmailValidationResponse } from "./validateEmailAddresses";
import { hideLoadingSpinner, showLoadingSpinner } from "./showHideSpinner";
export async function handelForgotPassword() {
	const emailInput: any = document.getElementById("inp-email-login");
	const emailValue = emailInput.value.trim();

	if (emailValue) {
		showLoadingSpinner();

		let emailIsValid: any = true;

		// check email validity
		// await getEmailValidationResponse(emailValue).then((res) => {
		// 	emailIsValid = res;
		// });

		if (emailIsValid) {
			// send password reset email
			appAuth.useDeviceLanguage();
			sendPasswordResetEmail(appAuth, emailValue)
				.then(() => {
					showInfoLogin(
						`A password reset email has been sent to ${emailValue} follow the instruction in the email to reset your password`,
					);
					setTimeout(() => {
						hideInfoLogin();
					}, 7000);
				})
				.catch((err) => {
					showInfoLogin(
						"there was an error while try to send password reset email please try again, if error persist change your network and try again.",
					);
					setTimeout(() => {
						hideInfoLogin();
					}, 6000);
				});
		}

		hideLoadingSpinner();
	} else {
		showInfoLogin("enter a valid email address...");
		setTimeout(() => {
			hideInfoLogin();
		}, 4000);
	}
}

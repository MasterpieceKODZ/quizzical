import { appAuth } from "@/firebase.config";
import { sendPasswordResetEmail } from "firebase/auth";
import { hideFormInfo, showFormInfo } from "./showHideFormInfo";
import { hideLoadingSpinner, showLoadingSpinner } from "./showHideSpinner";
// **************************************
export async function handelForgotPassword() {
	const emailInput: any = document.getElementById("inp-email-login");
	const emailValue = emailInput.value.trim();

	if (emailValue) {
		showLoadingSpinner();

		// send password reset email
		appAuth.useDeviceLanguage();
		sendPasswordResetEmail(appAuth, emailValue)
			.then(() => {
				showFormInfo(
					`A password reset email has been sent to ${emailValue} follow the instruction in the email to reset your password`,
					"login",
				);
				setTimeout(() => {
					hideFormInfo("login");
				}, 7000);
			})
			.catch((err: Error) => {
				// email address is not registered to an account
				if (err.message == "Firebase: Error (auth/user-not-found).") {
					showFormInfo(
						"cannot send password reset email to a non-existent account, check your email address and try again",
						"login",
					);
					setTimeout(() => {
						hideFormInfo("login");
					}, 7000);
				} else {
					// unknown error
					showFormInfo(
						"there was an error while trying to send password reset email please try again, if error persist change your network and try again.",
						"login",
					);
					setTimeout(() => {
						hideFormInfo("login");
					}, 7000);
				}
			});
	} else {
		showFormInfo("enter the email address registered to your account", "login");
		setTimeout(() => {
			hideFormInfo("login");
		}, 4000);
	}

	hideLoadingSpinner();
}

import {
	confirmPasswordReset,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { validatePasswordOnSubmit } from "./validatePassword";
import { appAuth } from "@/firebase.config";
import { hideLoadingSpinner, showLoadingSpinner } from "./showHideSpinner";
import { NextRouter } from "next/router";
// ****************************************************
export async function resetUserPassword(
	actionCode: string,
	email: string,
	router: NextRouter,
	setRetryPasswordReset: any,
) {
	const newPassword: any = document.getElementById("inp-password-reset");
	// set password input type back to password to prevent the form from remebering the input value if user submits the form while password is visible
	newPassword.type = "password";

	const newPwdVal = newPassword.value;

	if (newPwdVal) {
		// check validity of new password provided by user
		const passwordIsValid = validatePasswordOnSubmit("reset");

		//if password and action is valid reset password and sign in user
		if (passwordIsValid && actionCode) {
			showLoadingSpinner();
			confirmPasswordReset(appAuth, actionCode, newPwdVal)
				.then((res) => {
					signInWithEmailAndPassword(appAuth, email, newPwdVal)
						.then((credential) => {
							hideLoadingSpinner();
							if (credential.user.emailVerified) {
								if (credential.user.displayName) {
									router.push("/quizroom");
								} else {
									router.push("/signup_2");
								}
							} else {
								router.push("/request_email_verification");
							}
						})
						.catch((err) => {
							alert(
								"unable to sign you in, please go back to login screen and try to login with your new password",
							);
							setRetryPasswordReset(true);
							hideLoadingSpinner();
						});
				})
				.catch((err) => {
					alert(
						"unable to reset password at the moment, please check your network and try again",
					);
					setRetryPasswordReset(true);
					hideLoadingSpinner();
				});
		} else {
			alert(
				"Your password does not pass the minimum password requirements, change password and try again",
			);
			hideLoadingSpinner();
		}
	} else {
		alert("enter a valid password..");
	}
}

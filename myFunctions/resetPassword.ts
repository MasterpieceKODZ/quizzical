import {
	confirmPasswordReset,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { validatePasswordOnSubmit } from "./validatePassword";
import { appAuth } from "@/firebase.config";
import { hideLoadingSpinner, showLoadingSpinner } from "./showHideSpinner";
import { NextRouter } from "next/router";
export async function resetUserPassword(
	actionCode: string,
	email: string,
	router: NextRouter,
	setRetryPasswordReset: any,
) {
	const newPassword: any = document.getElementById("inp-password-reset");

	const newPwdVal = newPassword.value;

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
						router.push("/quizroom");
					})
					.catch((err) => {
						alert(
							"unable to sign you in please go back to login screen and try to login with your new password",
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
	}
}

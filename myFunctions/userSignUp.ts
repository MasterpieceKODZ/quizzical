import { appAuth } from "@/firebase.config";
import {
	UserCredential,
	createUserWithEmailAndPassword,
	sendEmailVerification,
} from "firebase/auth";
import { getEmailValidationResponse } from "./validateEmailAddress";
import { hideLoadingSpinner, showLoadingSpinner } from "./showHideSpinner";
import { validatePasswordOnSubmit } from "./validatePassword";
import { hideFormInfo, showFormInfo } from "./showHideFormInfo";

export default async function createUserAccount() {
	const signUpEmail: any = document.getElementById("inp-email-signup");
	const signUpPassword: any = document.getElementById("inp-password-signup");
	const confirmSignUpPassword: any = document.getElementById(
		"inp-confirm-password-signup",
	);
	// set password input type back to password to prevent the form from remebering the input value if user submits the form while password is visible
	signUpPassword.type = "password";
	confirmSignUpPassword.type = "password";

	hideFormInfo("signup");
	showLoadingSpinner();

	const passwordValue = signUpPassword.value;
	const emailValue = signUpEmail.value;

	let emailIsValid: any = true;

	// check email validity
	//await getEmailValidationResponse(emailValue, "signup").then((res) => {
	// 	emailIsValid = res;
	// });

	// check password validity by requirements
	let passwordIsValid = validatePasswordOnSubmit("signup");

	if (emailIsValid && passwordIsValid) {
		// check is passwords match
		if (passwordValue == confirmSignUpPassword.value) {
			// create new user account
			createUserWithEmailAndPassword(appAuth, emailValue, passwordValue)
				.then((userCredentials: UserCredential) => {
					// verifyy user email address
					sendEmailVerification(userCredentials.user, {
						url: "http://localhost:3000/signup_2",
					});
					hideLoadingSpinner();
					showFormInfo(
						`An email verification link has been sent to ${userCredentials.user.email}, you must verify your email to proceed, click the link in the email to verify your email address`,
						"signup",
						"info",
					);
					// dismiss message after 8 secs
					setTimeout(() => {
						hideFormInfo("signup");
					}, 8000);
				})
				.catch((err: Error) => {
					hideLoadingSpinner();
					if (err.message == "Firebase: Error (auth/email-already-in-use).") {
						showFormInfo(
							"There is already an account with this email address.",
							"signup",
							"info",
						);
						// dismiss message after 4 secs
						setTimeout(() => {
							hideFormInfo("signup");
						}, 4000);
					} else {
						showFormInfo(
							"An error occured while trying to create your account, please check your network and try again",
							"signup",
							"error",
						);
						// dismiss message after 6 secs
						setTimeout(() => {
							hideFormInfo("signup");
						}, 6000);
					}
				});
		} else {
			showFormInfo(
				"passwords do not match, check passwords and try again.",
				"signup",
				"error",
			);
			setTimeout(() => {
				hideFormInfo("signup");
			}, 5000);
		}
	} else {
		showFormInfo(
			"invalid email or password, please check and try again,",
			"signup",
			"error",
		);

		setTimeout(() => {
			hideFormInfo("signup");
		}, 5000);
	}

	hideLoadingSpinner();
}

export async function checkSignUpPasswordMatch() {
	const signUpPassword: any = document.getElementById("inp-password-signup");
	const confirmSignUpPassword: any = document.getElementById(
		"inp-confirm-password-signup",
	);

	if (signUpPassword.value != confirmSignUpPassword.value) {
		showFormInfo("passwords do not match", "signup", "error");
		setTimeout(() => {
			hideFormInfo("signup");
		}, 3000);
	} else {
		if (confirmSignUpPassword.value) {
			showFormInfo("passwords are a match", "signup", "info");
			setTimeout(() => {
				hideFormInfo("signup");
			}, 2000);
		}
	}
}

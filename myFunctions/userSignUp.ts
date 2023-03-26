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

	const passwordValue = signUpPassword.value.trim();
	const emailValue = signUpEmail.value.trim();

	let emailIsValid: any;

	//check email validity
	await getEmailValidationResponse(emailValue, "signup").then((res) => {
		emailIsValid = res;
	});

	// check password validity by requirements
	let passwordIsValid = validatePasswordOnSubmit("signup");

	if (emailIsValid) {
		if (passwordIsValid) {
			// check is passwords match
			if (passwordValue == confirmSignUpPassword.value.trim()) {
				// create new user account
				createUserWithEmailAndPassword(appAuth, emailValue, passwordValue)
					.then((userCredentials: UserCredential) => {
						// verifyy user email address
						sendEmailVerification(userCredentials.user, {
							url: "https://quizzical-masterpiecekodz.vercel.app/signup_2",
						});
						hideLoadingSpinner();
						showFormInfo(
							`An email verification link has been sent to ${userCredentials.user.email}, you must verify your email to proceed, click the link in the email to verify your email address`,
							"signup",
							"success",
						);
					})
					.catch((err: Error) => {
						hideLoadingSpinner();
						hideLoadingSpinner();
						if (err.message == "Firebase: Error (auth/email-already-in-use).") {
							showFormInfo(
								"There is already an account with this email address.",
								"signup",
								"error",
							);
							// dismiss message after 5 secs
							setTimeout(() => {
								hideFormInfo("signup");
							}, 5000);
						} else {
							showFormInfo(
								"An error occured while trying to create your account, please check your network and try again",
								"signup",
								"error",
							);
							// dismiss message after 8 secs
							setTimeout(() => {
								hideFormInfo("signup");
							}, 8000);
						}
					});
			} else {
				hideLoadingSpinner();
				showFormInfo(
					"passwords do not match, check passwords and try again.",
					"signup",
					"error",
				);
				setTimeout(() => {
					hideFormInfo("signup");
				}, 7000);
			}
		} else {
			hideLoadingSpinner();
			showFormInfo(
				"Your password does not pass the minimum password requirement,(6 letters, 1 or more numbers and 1 non-alphanumeric character.)",
				"signup",
				"error",
			);

			setTimeout(() => {
				hideFormInfo("signup");
			}, 7000);
		}
	} else {
		hideLoadingSpinner();
		showFormInfo(
			"invalid email, please check and try again,",
			"signup",
			"error",
		);

		setTimeout(() => {
			hideFormInfo("signup");
		}, 7000);
	}
}

export async function checkSignUpPasswordMatch() {
	const signUpPassword: any = document.getElementById("inp-password-signup");
	const confirmSignUpPassword: any = document.getElementById(
		"inp-confirm-password-signup",
	);

	if (signUpPassword.value != confirmSignUpPassword.value) {
		showFormInfo("passwords do not match", "signup", "error");
	} else {
		if (confirmSignUpPassword.value) {
			showFormInfo("passwords are a match", "signup", "success");
			setTimeout(() => {
				hideFormInfo("signup");
			}, 5000);
		}
	}
}

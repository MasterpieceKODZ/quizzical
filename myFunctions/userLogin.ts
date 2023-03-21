import { appAuth } from "@/firebase.config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { hideFormInfo, showFormInfo } from "./showHideFormInfo";
import { NextRouter } from "next/router";
import { hideLoadingSpinner } from "./showHideSpinner";

export default async function loginUserAccount(
	email: string,
	password: string,
	router: NextRouter,
) {
	signInWithEmailAndPassword(appAuth, email, password)
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
		.catch((err: Error) => {
			hideLoadingSpinner();
			if (err.message == "Firebase: Error (auth/user-not-found).") {
				showFormInfo(
					"account does not exist, check email and try again",
					"login",
					"error",
				);

				setTimeout(() => {
					hideFormInfo("login");
				}, 4000);
			} else if (err.message == "Firebase: Error (auth/wrong-password).") {
				showFormInfo(
					"incorrect password, check password and try again, or click forgot password to reset password",
					"login",
					"error",
				);

				setTimeout(() => {
					hideFormInfo("login");
				}, 5000);
			} else if (
				err.message == "Firebase: Error (auth/network-request-failed)."
			) {
				showFormInfo(
					"Network failure, please connect to a different network and try again.",
					"login",
					"error",
				);

				setTimeout(() => {
					hideFormInfo("login");
				}, 5000);
			}
		});
}

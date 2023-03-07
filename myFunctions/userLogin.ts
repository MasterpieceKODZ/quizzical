import { appAuth } from "@/firebase.config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { hideInfoLogin, showInfoLogin } from "./showHideLoginInfo";

export default async function loginUserAccount(
	email: string,
	password: string,
) {
	signInWithEmailAndPassword(appAuth, email, password)
		.then((credential) => {})
		.catch((err: Error) => {
			if (err.message == "Firebase: Error (auth/user-not-found).") {
				showInfoLogin("account does not exist, check email and try again");

				setTimeout(() => {
					hideInfoLogin();
				}, 4000);
			} else if (err.message == "Firebase: Error (auth/wrong-password).") {
				showInfoLogin(
					"incorrect password, check password and try again or click forgot password to reset password",
				);

				setTimeout(() => {
					hideInfoLogin();
				}, 5000);
			} else if (
				err.message == "Firebase: Error (auth/network-request-failed)."
			) {
				showInfoLogin(
					"Network failure, please connect to a different network and try again.",
				);

				setTimeout(() => {
					hideInfoLogin();
				}, 5000);
			}
		});
}

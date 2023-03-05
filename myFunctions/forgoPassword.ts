import { appAuth } from "@/firebase.config";
import { sendPasswordResetEmail } from "firebase/auth";
import { hideInfoLogin, showInfoLogin } from "./showHideLoginInfo";
export async function handelForgotPassword() {
	const emailInput: any = document.getElementById("inp-email-login");
	const emailValue = emailInput.value.trim();
	console.log("damn... I forgot my password.");
	appAuth.useDeviceLanguage();
	sendPasswordResetEmail(appAuth, emailValue, {
		url: "http://localhost:3000/login",
	})
		.then(() => {
			showInfoLogin(
				`A password reset email has been sent to ${emailValue} follow the instruction in the email to reset your password`,
			);
			setTimeout(() => {
				hideInfoLogin();
			}, 5000);
		})
		.catch((err) => {
			showInfoLogin(
				"there was an error while try to send password reset email please try again, if error persist change your network and try again.",
			);
			setTimeout(() => {
				hideInfoLogin();
			}, 5000);
		});
}

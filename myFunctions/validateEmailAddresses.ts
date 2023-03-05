import { hideLoadingSpinner } from "./showHideSpinner";

// validate email address on login
export async function loginEmailValidation(email: string): Promise<object> {
	let isValid: string;

	return new Promise(async (resolve, reject) => {
		// Abstract email validation API request
		await fetch(
			`https://emailvalidation.abstractapi.com/v1/?api_key=729bf559e22346b4b365f92e07e09482&email=${email}`,
		)
			.then(async (res) => {
				return res.json();
			})
			.then((resultData) => {
				// if email is valid and is not a catch all email return VALID
				if (
					resultData.deliverability == "DELIVERABLE" &&
					!resultData.is_catchall_email.value &&
					!resultData.is_role_email.value
				) {
					resolve({ emailState: "VALID" });
				}
				//if email is valid and it is a catch all email return CATCH_ALL
				else if (
					resultData.deliverability == "DELIVERABLE" &&
					resultData.is_catchall_email.value
				) {
					resolve({ emailState: "CATCH_ALL" });
				}
				//if email is valid and it is a role email return ROLE
				else if (
					resultData.deliverability == "DELIVERABLE" &&
					resultData.is_role_email.value
				) {
					resolve({ emailState: "ROLE" });
				}
				// if email has a typo return TYPO
				else if (
					resultData.deliverability != "DELIVERABLE" &&
					resultData.autocorrect
				) {
					resolve({ emailState: "TYPO", autocorrect: resultData.autocorrect });
				}
				//if email is invalid return INVALID
				else if (resultData.deliverability == "UNDELIVERABLE") {
					resolve({ emailState: "INVALID" });
				}
				//if email state is unknown return INVALID
				else if (resultData.deliverability != "DELIVERABLE") {
					resolve({ emailState: "INVALID" });
				}
			})
			.catch((err) => {
				const errorConsole: any = document.getElementById(
					"login-error-console",
				);
				hideLoadingSpinner();
				errorConsole.classList.remove("hidden");
				errorConsole.textContent =
					"There was an error while validating email please check your network and try again";
			});
	});
}

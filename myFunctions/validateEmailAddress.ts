import { hideFormInfo, showFormInfo } from "./showHideFormInfo";
import { hideLoadingSpinner } from "./showHideSpinner";

// validate email address on login
export async function validateEmailInputed(
	email: string,
	action: string,
): Promise<object> {
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
				hideLoadingSpinner();
				// show error console
				showFormInfo(
					"there was an error while validating email check your network and try again",
					action,
				);
				setTimeout(() => {
					hideFormInfo(action);
				}, 5000);
			});
	});
}

// returns a boolean promise showing the email validity
export async function getEmailValidationResponse(
	email: string,
	action: string,
) {
	const emailErrorTag: any = document.getElementById(`email-error-${action}`);

	let emailIsValid = false;

	// check the validity of the email provided by the user
	await validateEmailInputed(email, action).then((res: any) => {
		if (res.emailState == "VALID") {
			emailIsValid = true;
		} else if (res.emailState == "TYPO") {
			hideLoadingSpinner();
			emailErrorTag.textContent = `incorrect email, did you mean: ${res.autocorrect}`;
			emailErrorTag.classList.remove("hidden");
			emailIsValid = false;
		} else if (res.emailState == "INVALID") {
			hideLoadingSpinner();
			emailErrorTag.textContent = `invalid email please enter a valid email address and try again`;
			emailErrorTag.classList.remove("hidden");
			emailIsValid = false;
		} else if (res.emailState == "CATCH_ALL") {
			hideLoadingSpinner();
			emailErrorTag.textContent = `catch all emails are not valid use a different email address and try again.`;
			emailErrorTag.classList.remove("hidden");
			emailIsValid = false;
		} else if (res.emailState == "ROLE") {
			hideLoadingSpinner();
			emailErrorTag.textContent = `role emails are not valid use a different email and try again.`;
			emailErrorTag.classList.remove("hidden");
			emailIsValid = false;
		}
	});

	if (emailIsValid) {
		return new Promise((resolve, reject) => {
			resolve(true);
		});
	} else {
		new Promise((resolve, reject) => {
			resolve(false);
		});
	}
}

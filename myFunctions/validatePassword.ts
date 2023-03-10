import { hideFormInfo } from "./showHideFormInfo";

// review password while user is typing
export async function validatePasswordOnChange(e: any, action: string) {
	// exempt the password reset page because it has no info console
	if (action != "reset") {
		hideFormInfo(action);
	}

	const passwordCheckCont = document.getElementById(`password-check-${action}`);
	const letterCheckOk = document.querySelector(`.pw-letter-check-ok-${action}`);
	const letterCheckBad = document.querySelector(
		`.pw-letter-check-bad-${action}`,
	);
	const numCheckOk = document.querySelector(`.pw-num-check-ok-${action}`);
	const numCheckBad = document.querySelector(`.pw-num-check-bad-${action}`);
	const nonAlphanumCheckOk = document.querySelector(
		`.pw-non-alphanum-check-ok-${action}`,
	);
	const nonAlphanumCheckBad = document.querySelector(
		`.pw-non-alphanum-check-bad-${action}`,
	);
	passwordCheckCont?.classList.remove("hidden");
	letterCheckBad?.classList.remove("hidden");
	numCheckBad?.classList.remove("hidden");
	nonAlphanumCheckBad?.classList.remove("hidden");
	const inputValue: string = e.target.value.trim();

	// test password value with these regular expressions
	const letterRegex = new RegExp("[a-z]{6,}", "gi");
	const numRegex = new RegExp("[0-9]+", "gi");
	const nonAlphaNumRegex = new RegExp(/\W/, "gi");

	const letterTest = letterRegex.test(inputValue);
	const numTest = numRegex.test(inputValue);
	const nonAlphaNumTest = nonAlphaNumRegex.test(inputValue);

	if (letterTest) {
		letterCheckBad?.classList.add("hidden");
		letterCheckOk?.classList.remove("hidden");
	} else {
		letterCheckBad?.classList.remove("hidden");
		letterCheckOk?.classList.add("hidden");
	}

	if (numTest) {
		numCheckBad?.classList.add("hidden");
		numCheckOk?.classList.remove("hidden");
	} else {
		numCheckBad?.classList.remove("hidden");
		numCheckOk?.classList.add("hidden");
	}

	if (nonAlphaNumTest) {
		nonAlphanumCheckBad?.classList.add("hidden");
		nonAlphanumCheckOk?.classList.remove("hidden");
	} else {
		nonAlphanumCheckBad?.classList.remove("hidden");
		nonAlphanumCheckOk?.classList.add("hidden");
	}

	if (!inputValue) {
		letterCheckBad?.classList.remove("hidden");
		letterCheckOk?.classList.add("hidden");
		numCheckBad?.classList.remove("hidden");
		numCheckOk?.classList.add("hidden");
		nonAlphanumCheckBad?.classList.remove("hidden");
		nonAlphanumCheckOk?.classList.add("hidden");
	}
}

// validate password before submitting login form
export function validatePasswordOnSubmit(action: string) {
	const passwordInput: any = document.getElementById(`inp-password-${action}`);
	const passwordValue = passwordInput.value.trim();

	const letterRegex = new RegExp("[a-z]{6,}", "gi");
	const numRegex = new RegExp("[0-9]+", "gi");
	const nonAlphaNumRegex = new RegExp(/\W/, "gi");

	const pwLetterTest = letterRegex.test(passwordValue);
	const numTest = numRegex.test(passwordValue);
	const nonAlphaTest = nonAlphaNumRegex.test(passwordValue);

	if (pwLetterTest && numTest && nonAlphaTest) {
		return true;
	}

	return false;
}

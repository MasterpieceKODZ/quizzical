// review password while user is typing
export async function validatePasswordOnChange(e: any) {
	const passwordCheckCont = document.getElementById("password-check");
	const letterCheckOk = document.querySelector(".pw-letter-check-ok");
	const letterCheckBad = document.querySelector(".pw-letter-check-bad");
	const numCheckOk = document.querySelector(".pw-num-check-ok");
	const numCheckBad = document.querySelector(".pw-num-check-bad");
	const nonAlphanumCheckOk = document.querySelector(
		".pw-non-alphanum-check-ok",
	);
	const nonAlphanumCheckBad = document.querySelector(
		".pw-non-alphanum-check-bad",
	);
	passwordCheckCont?.classList.remove("hidden");
	letterCheckBad?.classList.remove("hidden");
	numCheckBad?.classList.remove("hidden");
	nonAlphanumCheckBad?.classList.remove("hidden");
	const inputValue: string = e.target.value.trim();
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
export function validatePasswordOnSubmit() {
	const passwordInput: any = document.getElementById("inp-password-login");
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

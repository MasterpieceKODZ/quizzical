import { AppDB, appAuth } from "@/firebase.config";
import { User, updateProfile } from "firebase/auth";
import { hideLoadingSpinner, showLoadingSpinner } from "./showHideSpinner";
import { closeInfoModal, openInfoModal } from "./openCloseQuizroomInfo";
import { doc, updateDoc } from "firebase/firestore";
import { isUsernameAvailable } from "./completeUserSignUp";
import { showFormInfo } from "./showHideFormInfo";
export async function showDisplayNameEditLayout() {
	const dnEdit = document.getElementById("new-dn-host");
	dnEdit?.classList.remove("hidden");
	dnEdit?.classList.add("flex");
}

export async function hideDisplayNameEditLayout() {
	const dnEdit = document.getElementById("new-dn-host");
	dnEdit?.classList.remove("flex");
	dnEdit?.classList.add("hidden");
}

export async function editUserName() {
	const usernameInput: any = document.getElementById("inp-new-display-name");

	const username = usernameInput.value.trim();
	const usernameAvail = await isUsernameAvailable(username);
	if (username) {
		const usernameReg = new RegExp(/\W/, "gi");
		if (!usernameReg.test(username)) {
			if (usernameAvail) {
				showLoadingSpinner();
				if (appAuth.currentUser)
					updateProfile(appAuth.currentUser as User, {
						displayName: username,
					})
						.then((r) => {
							if (appAuth.currentUser)
								updateDoc(doc(AppDB, "users", appAuth.currentUser.uid), {
									username,
								})
									.then((res) => {
										// navigate the user to quizroom on successful data upload
										hideLoadingSpinner();
										// reload page
										window.location.reload();
									})
									.catch((err) => {
										hideLoadingSpinner();
										openInfoModal(
											"",
											"unable to update username in database, it could be your network, try again later.",
											"error",
										);
										setTimeout(() => {
											closeInfoModal();
										}, 4000);
									});
						})
						.catch((e) => {
							hideLoadingSpinner();
							openInfoModal(
								"",
								"unable to update user display name, please try again later.",
								"error",
							);
							setTimeout(() => {
								closeInfoModal();
							}, 3000);
						});
			} else {
				openInfoModal(
					"",
					"the user name you provided has been taken by another user, change the username and try again",
					"error",
				);
				setTimeout(() => {
					closeInfoModal();
				}, 5000);
			}
		} else {
			openInfoModal(
				"",
				"Your username cannot contain any non-alphanumeric character,change your user name and try again",
				"error",
			);
			setTimeout(() => {
				closeInfoModal();
			}, 5000);
		}
	}
}

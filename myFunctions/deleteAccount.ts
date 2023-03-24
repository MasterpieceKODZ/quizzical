import {
	deleteUser,
	EmailAuthCredential,
	EmailAuthProvider,
	reauthenticateWithCredential,
	User,
} from "firebase/auth";
import { appAuth, AppDB, appStorage } from "@/firebase.config";
import { closeInfoModal, openInfoModal } from "./openCloseQuizroomInfo";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { hideLoadingSpinner, showLoadingSpinner } from "./showHideSpinner";

export async function showDeleteAcctModal() {
	const modal = document.getElementById("del-acct-modal");
	modal?.classList.remove("hidden");
	modal?.classList.add("flex");

	const delAlert: any = document.getElementById("del-acct-alert");
	delAlert.textContent =
		"This action is not reversible, if you delete your account you cannot recover it. Enter password to continue";
}

export async function hideDeleteAcctModal() {
	const delAlert: any = document.getElementById("del-acct-alert");
	delAlert.textContent = "";
	const modal = document.getElementById("del-acct-modal");
	modal?.classList.remove("flex");
	modal?.classList.add("hidden");
}

export async function deleteUserAccount() {
	const passwordInput: any = document.getElementById("del-acct-pw-inp");
	const password: string = passwordInput.value;

	if (password) {
		if (appAuth.currentUser) {
			showLoadingSpinner();
			const credential = EmailAuthProvider.credential(
				appAuth.currentUser.email as string,
				password,
			);
			reauthenticateWithCredential(appAuth.currentUser, credential)
				.then((credential) => {
					deleteDoc(doc(AppDB, "users", appAuth.currentUser?.uid as string))
						.then(() => {
							deleteObject(
								ref(
									appStorage,
									`profilePictures/${appAuth.currentUser?.uid}.png`,
								),
							)
								.then(() => {
									deleteUser(credential.user)
										.then(() => {
											hideLoadingSpinner();
										})
										.catch((e: Error) => {
											hideLoadingSpinner();
											openInfoModal(
												"",
												"Unable to delete account, check your network and try again later.",
												"error",
											);
											setTimeout(() => {
												closeInfoModal();
											}, 3000);
										});
								})
								.catch((e: Error) => {
									hideLoadingSpinner();
									openInfoModal(
										"",
										"Unable to delete user avatar, check your network and try again later.",
										"error",
									);
									setTimeout(() => {
										closeInfoModal();
									}, 3000);
								});
						})
						.catch((e: Error) => {
							hideLoadingSpinner();
							openInfoModal(
								"",
								"Unable to delete user data, check your network and try again later.",
								"error",
							);
							setTimeout(() => {
								closeInfoModal();
							}, 3000);
						});
				})
				.catch((e: Error) => {
					hideLoadingSpinner();
					if (e.message == "Firebase: Error (auth/wrong-password).") {
						openInfoModal(
							"",
							"Wrong password, check password and try again",
							"error",
						);
						setTimeout(() => {
							closeInfoModal();
						}, 3000);
					} else {
						openInfoModal(
							"",
							"Unable to re-authenticate account, check your network and try again later.",
							"error",
						);
						setTimeout(() => {
							closeInfoModal();
						}, 3000);
					}
				});
		}
	} else {
		openInfoModal(
			"",
			"You must enter your password to re-authenticate, before deleting your account",
			"error",
		);
		setTimeout(() => {
			closeInfoModal();
		}, 3000);
	}
}

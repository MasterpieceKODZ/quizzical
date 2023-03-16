import { AppDB, appAuth, appStorage } from "@/firebase.config";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { hideFormInfo, showFormInfo } from "./showHideFormInfo";
import { reduceBase64CodeSize } from "./reduceBase64Size";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import type { NextRouter } from "next/router";
import { hideLoadingSpinner, showLoadingSpinner } from "./showHideSpinner";

// update user data
export async function updateUserData(router: NextRouter) {
	showLoadingSpinner();
	const displayNameInput: any = document.getElementById("inp-display-name");
	const displayNameError: any = document.getElementById("username-error");

	const displayName = displayNameInput.value;

	if (displayName) {
		const nonAlphaNumRegex = new RegExp(/\W/, "gi");
		if (!nonAlphaNumRegex.test(displayName)) {
			const usernameIsAvail = await isUsernameAvailable(displayName);
			if (usernameIsAvail) {
				const avatar = document.querySelector(".active");
				// compel user to choose an avatar
				if (avatar) {
					const avaCl = avatar.classList;
					// check if the active avatar is a custom image or default avatar
					// user choose a default avatar
					if (avaCl.contains("avatar-img")) {
						// convert image to base64
						const imgCanvas = document.createElement("canvas");

						imgCanvas.width = avatar.width;
						imgCanvas.height = avatar.height;

						const context = imgCanvas.getContext("2d");

						context.drawImage(avatar, 0, 0, avatar.width, avatar.height);

						const avatarBase64 = context?.canvas.toDataURL("image/png");

						const compressdAvatarBase64 = await reduceBase64CodeSize(
							avatarBase64 as string,
							15,
							"image/png",
						);

						// upload image base64
						uploadString(
							ref(appStorage, `profilePictures/${appAuth.currentUser.uid}.png`),
							compressdAvatarBase64,
							"data_url",
						)
							.then((snapshot) => {
								// retrieve image download url
								getDownloadURL(snapshot.ref)
									.then((res) => {
										// update current user data
										updateProfile(appAuth.currentUser, {
											displayName,
											photoURL: res,
										})
											.then((r) => {
												// upload user data to firestore database
												setDoc(doc(AppDB, "users", appAuth.currentUser.uid), {
													imgURL: appAuth.currentUser.photoURL,
													username: appAuth.currentUser.displayName,
													email: appAuth.currentUser.email,
													gamerank: 0,
													highscore: 0,
												})
													.then((res) => {
														// navigate the user to quizroom on successful data upload
														hideLoadingSpinner();
														router.push("/quizroom");
													})
													.catch((err) => {
														hideLoadingSpinner();
														showFormInfo(
															"Unable to update user info, it could be your network.",
															"signup2",
															"error",
														);
														setTimeout(() => {
															hideFormInfo("signup2");
														}, 5000);
													});
											})
											.catch((err) => {
												hideLoadingSpinner();
												showFormInfo(
													"Unable to update user info, it could be your network.",
													"signup2",
													"error",
												);
												setTimeout(() => {
													hideFormInfo("signup2");
												}, 5000);
											});
									})
									.catch((err) => {
										hideLoadingSpinner();
										showFormInfo(
											"Image upload failed,check your network and try again.",
											"signup2",
											"error",
										);
										setTimeout(() => {
											hideFormInfo("signup2");
										}, 5000);
									});
							})
							.catch((err) => {
								hideLoadingSpinner();
								showFormInfo(
									"Image upload failed,check your network and try again.",
									"signup2",
									"error",
								);
								setTimeout(() => {
									hideFormInfo("signup2");
								}, 5000);
							});
					}
					// if user uploaded a custom image
					else if (avaCl.contains("upload-photo")) {
						const imgPrev = document.getElementById("img-upload-preview");

						// retrieve image base64 from the preview image src
						const customImgBase64 = imgPrev.src;

						// upload image base64
						uploadString(
							ref(appStorage, `profilePictures/${appAuth.currentUser.uid}.png`),
							customImgBase64,
							"data_url",
						)
							.then((snapshot) => {
								// retrieve image download url
								getDownloadURL(snapshot.ref)
									.then((res) => {
										// update current user data
										updateProfile(appAuth.currentUser, {
											displayName,
											photoURL: res,
										})
											.then((r) => {
												// upload user data to firestore database
												setDoc(doc(AppDB, "users", appAuth.currentUser.uid), {
													imgURL: appAuth.currentUser.photoURL,
													username: appAuth.currentUser.displayName,
													email: appAuth.currentUser.email,
													gamerank: 0,
													highscore: 0,
												})
													.then((res) => {
														// navigate the user to quizroom on successful data upload
														hideLoadingSpinner();
														router.push("/quizroom");
													})
													.catch((err) => {
														hideLoadingSpinner();
														showFormInfo(
															"Unable to update user info, it could be your network.",
															"signup2",
															"error",
														);
														setTimeout(() => {
															hideFormInfo("signup2");
														}, 4000);
													});
											})
											.catch((err) => {
												hideLoadingSpinner();
												showFormInfo(
													"Unable to update user info, it could be your network.",
													"signup2",
													"error",
												);
												setTimeout(() => {
													hideFormInfo("signup2");
												}, 4000);
											});
									})
									.catch((err) => {
										hideLoadingSpinner();
										showFormInfo(
											"Image upload failed,check your network and try again.",
											"signup2",
											"error",
										);
										setTimeout(() => {
											hideFormInfo("signup2");
										}, 4000);
									});
							})
							.catch((err) => {
								hideLoadingSpinner();
								showFormInfo(
									"Image upload failed,check your network and try again.",
									"signup2",
									"error",
								);
								setTimeout(() => {
									hideFormInfo("signup2");
								}, 4000);
							});
					}
				} else {
					hideLoadingSpinner();
					showFormInfo(
						"choose an avatar or upload an image",
						"signup2",
						"error",
					);
					setTimeout(() => {
						hideFormInfo("signup2");
					}, 4000);
				}
			} else {
				hideLoadingSpinner();
				displayNameInput?.focus();
				displayNameError?.classList.remove("hidden");
				displayNameError.textContent = "username is taken.";
			}
		} else {
			hideLoadingSpinner();
			displayNameInput?.focus();
			displayNameError?.classList.remove("hidden");
			displayNameError.textContent =
				"username cannot contain any non-alphanumeric character";
		}
	} else {
		hideLoadingSpinner();
		displayNameInput?.focus();
		displayNameError?.classList.remove("hidden");
		displayNameError.textContent = "please choose a username";
	}
}

// displayname input on change listener function
export async function displayNameOnChange(e: any) {
	const dnError = document.getElementById("username-error");
	dnError.textContent = "";
	dnError?.classList.add("hidden");

	const nonAlphaNumRegex = new RegExp(/\W/, "gi");
	const displayNameError = document.getElementById("username-error");

	if (nonAlphaNumRegex.test(e.target.value)) {
		displayNameError?.classList.remove("hidden");
		displayNameError.textContent =
			"username cannot contain any non-alphanumeric character";
	} else {
		displayNameError.textContent = "";
		displayNameError?.classList.add("hidden");
	}
}

// check if username has been taken by another user
async function isUsernameAvailable(username: string) {
	const usersDocs = await getDocs(collection(AppDB, "users"));

	let nameIsAvailable = true;

	usersDocs.forEach((doc) => {
		if (doc.data().username == username) {
			nameIsAvailable = false;
		}
	});

	return nameIsAvailable;
}

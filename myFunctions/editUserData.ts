import type { Dispatch, SetStateAction } from "react";
import { closeInfoModal, openInfoModal } from "./openCloseQuizroomInfo";
import { reduceBase64CodeSize } from "./reduceBase64Size";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { AppDB, appAuth, appStorage } from "@/firebase.config";
import { User, updateProfile } from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { hideLoadingSpinner, showLoadingSpinner } from "./showHideSpinner";
import { closeImageCropperModal } from "./openCloseImageCropperModal";
import Cropper from "cropperjs";

export async function viewUserProfile(
	setShow: Dispatch<SetStateAction<boolean>>,
) {
	setShow(true);
}

export async function closeModal(setHide: Dispatch<SetStateAction<boolean>>) {
	setHide(false);
}

export async function updateUserProfilePic(
	setShow: Dispatch<SetStateAction<boolean>>,
) {
	setShow(true);
}

export async function finishImageEdit(cropper: Cropper) {
	const avatar: any = document.querySelector(".active");

	if (avatar) {
		showLoadingSpinner();
		// if user selected a default avatar
		if (avatar.classList.contains("avatar-img")) {
			// convert image to base64
			const imgCanvas = document.createElement("canvas");

			imgCanvas.width = avatar.width;
			imgCanvas.height = avatar.height;

			const context = imgCanvas.getContext("2d");

			context?.drawImage(avatar, 0, 0, avatar.width, avatar.height);

			const avatarBase64 = context?.canvas.toDataURL("image/png");

			const compressdAvatarBase64 = await reduceBase64CodeSize(
				avatarBase64 as string,
				30,
				"image/png",
			);

			if (appAuth.currentUser)
				// upload image base64
				uploadString(
					ref(appStorage, `profilePictures/${appAuth.currentUser?.uid}.png`),
					compressdAvatarBase64,
					"data_url",
				)
					.then((snapshot) => {
						// retrieve image download url
						getDownloadURL(snapshot.ref)
							.then((res) => {
								// update current user data
								updateProfile(appAuth.currentUser as User, {
									photoURL: res,
								})
									.then((r) => {
										// upload user data to firestore database
										if (appAuth.currentUser)
											updateDoc(doc(AppDB, "users", appAuth.currentUser.uid), {
												imgURL: appAuth.currentUser.photoURL,
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
														"unable to update user profile picture in database, it could be your network, try again later.",
														"error",
													);
													setTimeout(() => {
														closeInfoModal();
														closeImageCropperModal(cropper);
													}, 5000);
												});
									})
									.catch((err) => {
										hideLoadingSpinner();
										openInfoModal(
											"",
											"unable to update user photoURL, please try again later.",
											"error",
										);
										setTimeout(() => {
											closeInfoModal();
										}, 5000);
									});
							})
							.catch((err) => {
								hideLoadingSpinner();
								openInfoModal(
									"",
									"Unable to fetch image URL, check your network and try again.",
									"error",
								);
								setTimeout(() => {
									closeInfoModal();
								}, 5000);
							});
					})
					.catch((err) => {
						hideLoadingSpinner();
						openInfoModal(
							"",
							"Image upload failed, check your network and try again later",
							"error",
						);
						setTimeout(() => {
							closeInfoModal();
						}, 5000);
					});
		} else if (avatar.classList.contains("upload-photo")) {
			const imgPrev: any = document.getElementById("img-upload-preview");

			// retrieve image base64 from the preview image src
			const customImgBase64 = imgPrev.src;

			if (appAuth.currentUser)
				// upload image base64
				uploadString(
					ref(appStorage, `profilePictures/${appAuth.currentUser?.uid}.png`),
					customImgBase64,
					"data_url",
				)
					.then((snapshot) => {
						// retrieve image download url
						getDownloadURL(snapshot.ref)
							.then((res) => {
								// update current user data
								updateProfile(appAuth.currentUser as User, {
									photoURL: res,
								})
									.then((r) => {
										// upload user data to firestore database
										if (appAuth.currentUser)
											updateDoc(doc(AppDB, "users", appAuth.currentUser.uid), {
												imgURL: appAuth.currentUser.photoURL,
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
														"unable to update user profile picture in database, it could be your network, try again later.",
														"error",
													);
													setTimeout(() => {
														closeInfoModal();
														closeImageCropperModal(cropper);
													}, 5000);
												});
									})
									.catch((err) => {
										hideLoadingSpinner();
										openInfoModal(
											"",
											"unable to update user data, please try again later.",
											"error",
										);
										setTimeout(() => {
											closeInfoModal();
										}, 5000);
									});
							})
							.catch((err) => {
								hideLoadingSpinner();
								openInfoModal(
									"",
									"Unable to fetch image URL, check your network and try again.",
									"error",
								);
								setTimeout(() => {
									closeInfoModal();
								}, 5000);
							});
					})
					.catch((err) => {
						hideLoadingSpinner();
						openInfoModal(
							"",
							"Image upload failed, check your network and try again later",
							"error",
						);
						setTimeout(() => {
							closeInfoModal();
						}, 5000);
					});
		}
	} else {
		openInfoModal("", "Please select an avatar or upload an image", "error");
		setTimeout(() => {
			closeInfoModal();
		}, 3000);
	}
}

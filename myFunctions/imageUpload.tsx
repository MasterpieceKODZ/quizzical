import Cropper from "cropperjs";
import { Dispatch, SetStateAction } from "react";
import { reduceBase64CodeSize } from "./reduceBase64Size";
import checkBase64FileSize from "./reduceBase64Size";
import {
	closeImageCropperModal,
	openImageCropperModal,
} from "./openCloseImageCropperModal";
import { showLoadingSpinner } from "./showHideSpinner";

// select an avatar
export async function selectAvatar(e: any) {
	const activeAvatar = document.querySelector(".active");

	if (activeAvatar) {
		activeAvatar.classList.remove("active");
	}

	e.target.classList.add("active");
}

// upload picture from device
export async function uploadImage() {
	const imgFile = document.getElementById("profile-pic-file");
	imgFile?.click();
}

// image file on change listener
export async function handelImageFileSelection(e: any) {
	const activeAvatar = document.querySelector(".active");

	if (activeAvatar) {
		activeAvatar.classList.remove("active");
	}
	return new Promise((resolve, reject) => {
		const filereader = new FileReader();
		const file = e.target.files[0];

		filereader.readAsDataURL(file);

		filereader.onload = (e) => {
			openImageCropperModal();
			const cropperImg = document.getElementById("cropper-img");
			cropperImg.src = e.target.result;

			const theCropper = new Cropper(cropperImg, {
				viewMode: 1,
				dragMode: "none",
				aspectRatio: 1,
				autoCrop: true,
				autoCropArea: 0.8,
				scalable: false,
				movable: false,
				rotatable: false,
				zoomable: false,
				minCropBoxWidth: 100,
				minCropBoxHeight: 100,
				cropBoxResizable: false,
				responsive: true,
				ready() {
					resolve(this.cropper);
				},
			});
		};
	});
}

// crop selected image
export async function cropImage(cropper: Cropper, imageType: string) {
	showLoadingSpinner();
	const croppedImage = cropper.getCroppedCanvas().toDataURL(imageType);

	const reducedBase64 = await reduceBase64CodeSize(croppedImage, 20, imageType);

	document.getElementById("img-upload-preview").src = reducedBase64;

	document.querySelector(".upload-photo")?.classList.add("active");

	closeImageCropperModal(cropper);
}

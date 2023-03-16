import { hideLoadingSpinner } from "./showHideSpinner";

export async function openImageCropperModal() {
	const imgCropperModal = document.getElementById("img-cropper-modal");
	imgCropperModal?.classList.remove("hidden");
	imgCropperModal?.classList.add("flex");
}

export async function closeImageCropperModal(imageCropper: Cropper) {
	// destroy cropper instance
	const cropperImage: any = document.getElementById("cropper-img");
	cropperImage.cropper.destroy();
	// close cropper modal
	const imgCropperModal = document.getElementById("img-cropper-modal");
	imgCropperModal?.classList.remove("flex");
	imgCropperModal?.classList.add("hidden");
	// clear image input value
	const fileInput: any = document.getElementById("profile-pic-file");
	fileInput.value = "";
	hideLoadingSpinner();
}

/* eslint-disable @next/next/no-img-element */
import BallSpinnerModal from "@/components/BallSpinners";
import { appAuth } from "@/firebase.config";
import {
	displayNameOnChange,
	updateUserData,
} from "@/myFunctions/completeUserSignUp";
import {
	cropImage,
	handelImageFileSelection,
	selectAvatar,
	uploadImage,
} from "@/myFunctions/imageUpload";
import { closeImageCropperModal } from "@/myFunctions/openCloseImageCropperModal";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged, signOut } from "firebase/auth";
const SignUp2 = () => {
	const router = useRouter();
	let imageCropper: any;
	let fileType: any;
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(appAuth, (user) => {
			// check if the user is signed in
			if (user) {
				// refresh user authentication data
				user?.reload().then((r) => {
					// if after reload the user email is still not verified navigate the user to request email verification page
					if (!user?.emailVerified) {
						router.push("/request_email_verification");
					} else {
						// if the user already has a display name set redirect user to quizroom
						if (user.displayName) {
							router.push("/quizroom");
						} else {
							// annouce page name with screen reader
							const pageNameLogin: any =
								document.getElementById("page-name-SR");
							pageNameLogin.textContent = "A Few More Details...";
						}
					}
				});
			} else {
				router.push("/login");
			}
		});

		return () => {
			unsubscribe();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<div className="signup-root h-[100vh] w-[100vw] overflow-hidden relative bg-slate-200">
			<div className="h-[100vh] overflow-y-auto">
				<div className="flex items-center justify-center py-3">
					<img
						src="/brand.png"
						alt="brand quizzical"
						className="img-signup-brand w-[30%] max-w-[215px] min-w-[130px] h-auto object-cover"
					/>
				</div>
				<p
					tabIndex={1}
					className="text-center my-1 text-primary font-bold text-[18px] mobileL:text-[23px] mobileXL:text-[29px] font-julee w-max mx-auto">
					A Few More Details
				</p>
				<div className="w-[90%] max-w-[400px] mt-4 mx-auto">
					<label
						htmlFor="inp-display-name"
						className="w-[80%] block text-[16px] mobileL:text-[18px] mobileXL:text-[22px] mx-auto">
						Display Name
					</label>
					<input
						type="text"
						name="displayname"
						id="inp-display-name"
						className="block mx-auto w-[80%] rounded p-[2px] mobileL:text-[18px] mobileXL:text-[22px]"
						required
						onChange={displayNameOnChange}
					/>
					<p
						role="alert"
						aria-atomic="true"
						id="username-error"
						className="mt-2 text-red-600 text-[10px] mobileL:text-[14px] mobileXL:text-[17px] w-[80%] hidden mx-auto"></p>
				</div>
				<div className="w-[90%] max-w-[400px] mx-auto mt-3">
					<p className="text-center">Choose An Avatar</p>
					<div className="p-2 flex flex-wrap items-center justify-evenly">
						<img
							src="/avatar-1.png"
							tabIndex={0}
							alt="avatar 1"
							className="w-[70px] h-auto object-cover inline-block m-2 avatar-img"
							onClick={(e) => {
								selectAvatar(e);
							}}
						/>
						<img
							src="/avatar-2.png"
							tabIndex={0}
							alt="avatar 2"
							className="w-[70px] h-auto object-cover inline-block m-2 avatar-img"
							onClick={(e) => {
								selectAvatar(e);
							}}
						/>
						<img
							src="/avatar-3.png"
							tabIndex={0}
							alt="avatar 3"
							className="w-[70px] h-auto object-cover inline-block m-2 avatar-img"
							onClick={(e) => {
								selectAvatar(e);
							}}
						/>
						<img
							src="/avatar-4.png"
							tabIndex={0}
							alt="avatar 4"
							className="w-[70px] h-auto object-cover inline-block m-2 avatar-img"
							onClick={(e) => {
								selectAvatar(e);
							}}
						/>
						<img
							src="/avatar-5.png"
							tabIndex={0}
							alt="avatar 5"
							className="w-[70px] h-auto object-cover inline-block m-2 avatar-img"
							onClick={(e) => {
								selectAvatar(e);
							}}
						/>
						<img
							src="/avatar-6.png"
							tabIndex={0}
							alt="avatar 6"
							className="w-[70px] h-auto object-cover inline-block m-2 avatar-img"
							onClick={(e) => {
								selectAvatar(e);
							}}
						/>
						<img
							src="/avatar-7.png"
							tabIndex={0}
							alt="avatar 7"
							className="w-[70px] h-auto object-cover inline-block m-2 avatar-img"
							onClick={(e) => {
								selectAvatar(e);
							}}
						/>
						<img
							tabIndex={0}
							src="/avatar-8.png"
							alt="avatar 8"
							className="w-[70px] h-auto object-cover inline-block m-2 avatar-img"
							onClick={(e) => {
								selectAvatar(e);
							}}
						/>
						<img
							src="/avatar-9.png"
							tabIndex={0}
							alt="avatar 9"
							className="w-[70px] h-auto object-cover inline-block m-2 avatar-img"
							onClick={(e) => {
								selectAvatar(e);
							}}
						/>
						<img
							src="/avatar-10.png"
							tabIndex={0}
							alt="avatar 10"
							className="w-[70px] h-auto object-cover inline-block m-2 avatar-img"
							onClick={(e) => {
								selectAvatar(e);
							}}
						/>
						<img
							src="/avatar-11.png"
							tabIndex={0}
							alt="avatar 11"
							className="w-[70px] max-w-[70px] h-auto object-cover inline-block m-2 avatar-img"
							onClick={(e) => {
								selectAvatar(e);
							}}
						/>
						<div
							className="w-[70px] max-w-[70px] h-[70px] max-h-[70px]  inline-block m-2 upload-photo relative overflow-hidden"
							id="custom-img-host">
							<img
								id="img-upload-preview"
								src="/custom_img_PH.png"
								alt="avatar 11"
								className="w-full h-full object-cover"
							/>
							<div
								tabIndex={0}
								role="button"
								aria-label="select custom avatar"
								className="w-full h-full absolute top-0 left-0 overflow-hidden bg-[#9da9b363]"
								onClickCapture={(e) => {
									const imgPrev: any =
										document.getElementById("img-upload-preview");
									const activeAvatar = document.querySelector(".active");

									if (activeAvatar) {
										activeAvatar.classList.remove("active");
									}

									// if custom image has not been selected, select new custom  image, else set selected image preview as active avatar

									if (imgPrev?.src.endsWith("/upload-img.jpg")) {
										uploadImage();
									} else {
										document
											.getElementById("custom-img-host")
											?.classList.add("active");
									}
								}}>
								<button
									aria-label="upload custom avatar"
									className=" w-full h-max text-center absolute bottom-0 text-white"
									onClick={(e) => {
										uploadImage();
									}}>
									<i className="fas fa-file-arrow-up"></i> Edit
								</button>
							</div>
						</div>

						<input
							tabIndex={-1}
							type="file"
							name="uploadimage"
							accept=".jpg, .jpeg, .png, .webp"
							id="profile-pic-file"
							className="w-0 h-0 overflow-hidden"
							onChange={async (e: any) => {
								// render the selected image on the image cropper modal
								await handelImageFileSelection(e).then((res) => {
									imageCropper = res;
									fileType = e.target.files[0].type;
								});
							}}
						/>
					</div>
				</div>
				<p
					role="alert"
					id="signup2-error-console"
					className="w-[80%] text-center text-[10px] mobileL:text-[14px] mobileXL:text-[18px] p-2 mt-3 rounded-md mx-auto hidden"></p>
				{/* screen readers only */}
				<p
					role="alert"
					id="page-name-SR"
					className="w-0 h-0 overflow-hidden"></p>
				<button
					type="button"
					className=" min-w-[180px] min-h-[46px] p-0 mt-4 rounded-lg bg-[#4e4ec2] block mx-auto mb-6 relative overflow-hidden"
					onClick={(e) => updateUserData(router)}>
					<div className="w-[95%] bg-primary py-[2px] m-0 rounded-lg sub-btn-in absolute top-[50%] translate-y-[-52%] left-[50%] translate-x-[-50%] text-center text-white text-[16px]  mobileL:text-[18px] mobileXL:text-[22px]">
						PROCEED
					</div>
				</button>
			</div>
			{/* ------- cropper modal -------- */}

			<div
				id="img-cropper-modal"
				className="absolute w-[100vw] h-[100vh] top-0 left-0 bottom-0 right-0 bg-[#9da9b3f3] justify-center items-center hidden">
				<div
					id="img-cropper-cont"
					className="w-[95vw] max-w-[450px] p-2 rounded-md border-2 border-accent">
					<div
						id="cropper-img-holder"
						className="w-[75vw] h-[75vw] max-w-[350px] max-h-[350px] overflow-y-auto overflow-x-hidden border-2 border-primary mt-2 mx-auto mb-4 cropper-image-cont">
						<img
							id="cropper-img"
							className="w-full h-auto"
							src="/placeholder.jpg"
							alt="image cropper placeholder"
						/>
					</div>
					<button
						type="button"
						className=" min-w-[180px] min-h-[46px] p-0 mt-2 rounded-lg bg-[#4e4ec2] block mx-auto mb-6 relative overflow-hidden">
						<div
							className="w-[95%] bg-primary py-[2px] m-0 rounded-lg sub-btn-in absolute top-[50%] translate-y-[-52%] left-[50%] translate-x-[-50%] text-center text-white text-[16px]  mobileL:text-[18px] mobileXL:text-[22px]"
							onClick={(e) => {
								cropImage(imageCropper as Cropper, fileType as string);
							}}>
							CROP IMAGE
						</div>
					</button>
					<button
						type="button"
						className=" min-w-[180px] min-h-[46px] p-0 mt-2 rounded-lg bg-red-500 block mx-auto mb-6 relative overflow-hidden">
						<div
							className="w-[95%] bg-red-800 py-[2px] m-0 rounded-lg sub-btn-in absolute top-[50%] translate-y-[-52%] left-[50%] translate-x-[-50%] text-center text-white text-[16px]  mobileL:text-[18px] mobileXL:text-[22px]"
							onClick={(e) => {
								closeImageCropperModal(imageCropper as Cropper);
							}}>
							CANCEL
						</div>
					</button>
				</div>
			</div>
			<button
				className="absolute top-0 left-0"
				onClick={(e) => {
					signOut(appAuth);
				}}>
				Sign Out
			</button>

			<BallSpinnerModal />
		</div>
	);
};

export default SignUp2;

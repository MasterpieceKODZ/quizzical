import BallSpinnerModal from "@/components/BallSpinners";
import { appAuth } from "@/firebase.config";
import {
	passwordIsBlur,
	passwordIsFocused,
	showHidePassword,
} from "@/myFunctions/passwordFocus";
import { resetUserPassword } from "@/myFunctions/resetPassword";
import {
	hideLoadingSpinner,
	showLoadingSpinner,
} from "@/myFunctions/showHideSpinner";
import { validatePasswordOnChange } from "@/myFunctions/validatePassword";
import { applyActionCode, verifyPasswordResetCode } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const PasswordReset = () => {
	const [pwResetActionCode, setActionCode] = useState("");
	const [accountEmail, setAccountEmail] = useState("");
	const [retryReset, setRetryReset] = useState(false);
	const [continueURLState, setContinueURLState] = useState("");
	const router = useRouter();
	useEffect(() => {
		// show ball spinner
		showLoadingSpinner();
		// fetch oobCode from URL
		const urlParams = new Proxy(new URLSearchParams(window.location.search), {
			get: (searchParams: any, prop: any) => searchParams.get(prop),
		});
		const actionCode = urlParams.oobCode;
		const actionType = urlParams.mode;
		const contURl = urlParams.continueUrl;

		const emailActionConsole = document.getElementById("email-action-console");
		emailActionConsole?.classList.remove("hidden");
		//handel email action by type
		switch (actionType) {
			case "resetPassword":
				// if action code is not undefined verify password reset code state
				if (actionCode) {
					setActionCode(actionCode);
					// if password reset code is still valid show new password input console
					verifyPasswordResetCode(appAuth, actionCode)
						.then((email) => {
							// update account email state
							setAccountEmail(email);
							const newPasswordConsole = document.getElementById(
								"new-password-console",
							);
							newPasswordConsole?.classList.remove("hidden");
							hideLoadingSpinner();
						})
						.catch((err) => {
							hideLoadingSpinner();
							alert("action code has expired go back and try again.");
							setRetryReset(true);
						});
				} else {
					hideLoadingSpinner();
					alert(
						"an error occured, it could be your network, go back and try again.",
					);

					setRetryReset(true);
				}
				break;
			case "verifyEmail":
				// update continue URL
				setContinueURLState(contURl);
				//confirm email verification
				applyActionCode(appAuth, actionCode)
					.then((res) => {
						hideLoadingSpinner();
						const verifyEmailInfo = document.getElementById(
							"verify-email-console",
						);
						verifyEmailInfo?.classList.remove("hidden");
						verifyEmailInfo?.classList.add("flex");
					})
					.catch((err) => {
						const verifyEmailInfo: any = document.getElementById(
							"verify-email-console",
						);
						verifyEmailInfo.textContent =
							"Error:\nThe email link is probably expired go back to login page and request a new link";
					});

				break;

			default:
				break;
		}
	}, []);

	return (
		<div className="relative flex items-center justify-center min-h-[100vh]">
			<div
				id="email-action-console"
				className={`w-[90%] max-w-[400px] border-[1.5px] border-accent rounded-lg py-10 px-4 bg-slate-200 hidden`}>
				<div
					id="new-password-console"
					className={`w-full h-full ${retryReset ? "" : "hidden"}`}>
					<label
						htmlFor="#inp-password-reset"
						className={`block ${retryReset ? "hidden" : ""} ml-[5%]`}>
						New Password
					</label>
					<div className=" block w-[90%] p-[1px] mx-auto rounded-lg border-2 ring-1 ring-slate-600 relative bg-white overflow-hidden">
						<input
							type="password"
							name="resetpassword"
							id="inp-password-reset"
							className="inline w-[85%] outline-white bg-transparent"
							onChange={(e) => {
								validatePasswordOnChange(e, "reset");
							}}
							onFocus={(e) => passwordIsFocused(e)}
							onBlur={(e) => passwordIsBlur(e)}
							required
						/>
						{/* secondary password toggle */}
						<i
							className="fas fa-eye ml-1"
							onClick={(e) => showHidePassword(e)}></i>
					</div>
					<div
						id="password-check-reset"
						className={`text-[12px] hidden ${retryReset ? "hidden" : ""}`}>
						<p>at least...</p>
						<p className="pw-letter-check-ok-reset text-green-500 hidden">
							6 letters. <i className="fas fa-check"></i>
						</p>
						<p className="pw-letter-check-bad-reset text-red-500 hidden">
							6 letters. <i className="fas fa-xmark"></i>
						</p>
						<p className="pw-num-check-ok-reset text-green-500 hidden">
							1 number. <i className="fas fa-check"></i>
						</p>
						<p className="pw-num-check-bad-reset text-red-500 hidden">
							1 number. <i className="fas fa-xmark"></i>
						</p>
						<p className="pw-non-alphanum-check-ok-reset text-green-500 hidden">
							1 non-alphanumeric character. <i className="fas fa-check"></i>
						</p>
						<p className="pw-non-alphanum-check-bad-reset text-red-500 hidden">
							1 non-alphanumeric character. <i className="fas fa-xmark"></i>
						</p>
					</div>
					<button
						className={`w-max px-10 py-[1px] bg-accent hover:bg-primary text-white hover:text-secondary ring-2 ring-gray-400 block mx-auto my-8 rounded-xl text-[18px] ${
							retryReset ? "hidden" : ""
						}`}
						onClick={() => {
							resetUserPassword(
								pwResetActionCode,
								accountEmail,
								router,
								setRetryReset,
							);
						}}>
						Confirm
					</button>
					<Link
						href="/login"
						className={`w-max px-10 py-[1px] bg-accent hover:bg-primary text-white hover:text-secondary ring-2 ring-gray-400 block mx-auto my-8 rounded-xl text-[18px] ${
							retryReset ? "" : "hidden"
						}`}>
						Retry
					</Link>
				</div>
				<div
					id="verify-email-console"
					className="w-full h-full hidden justify-center items-center">
					<p className=" mx-2 text-center text-slate-700 font-specialElite">
						Your email has been verified click continue to proceed
					</p>
					{/* show continue button if continue URL is valid */}
					{continueURLState ? (
						<Link
							href={continueURLState}
							className={`w-max px-10 py-[1px] bg-accent hover:bg-primary text-white hover:text-secondary ring-2 ring-gray-400 block mx-auto my-8 rounded-xl text-[18px]`}
							id="verify-email-continue-btn">
							Continue
						</Link>
					) : (
						""
					)}
					{/* if continue URL is not valid show retry button */}
					{!continueURLState ? (
						<Link
							href="/request_email_verification"
							className={`w-max px-10 py-[1px] bg-accent hover:bg-primary text-white hover:text-secondary ring-2 ring-gray-400 block mx-auto my-8 rounded-xl text-[18px]`}
							id="verify-email-continue-btn">
							Retry
						</Link>
					) : (
						""
					)}
				</div>
			</div>
			<BallSpinnerModal />
		</div>
	);
};

export default PasswordReset;

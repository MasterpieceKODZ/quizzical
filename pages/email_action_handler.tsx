import BallSpinnerModal from "@/components/BallSpinners";
import { appAuth } from "@/firebase.config";
import {
	passwordFocusAssist,
	showHidePassword,
} from "@/myFunctions/passwordToggle";
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
							setTimeout(() => {
								document.getElementById("inp-password-reset")?.focus();
							}, 1000);
						})
						.catch((err) => {
							hideLoadingSpinner();
							alert(
								"action code has expired, click the retry button to go back and try again.",
							);
							setRetryReset(true);
							document.getElementById("btn-retry-password-reset")?.focus();
						});
				} else {
					hideLoadingSpinner();
					alert(
						"an error occured, it could be your network, click the retry button to go back and try again.",
					);

					setRetryReset(true);
					document.getElementById("btn-retry-password-reset")?.focus();
				}
				break;
			case "verifyEmail":
				// update continue URL
				setContinueURLState(contURl);
				//confirm email verification
				applyActionCode(appAuth, actionCode)
					.then((res) => {
						hideLoadingSpinner();
						const verifyEmailConsole = document.getElementById(
							"verify-email-console",
						);
						verifyEmailConsole?.classList.remove("hidden");
						verifyEmailConsole?.classList.add("flex");
						// read email verification status for screen readers
						const emailVerStat: any =
							document.getElementById("email-verif-status");
						emailVerStat.textContent =
							"Your email has been verified, click continue to proceed";

						// set focus on continue link button to assist screen reader users

						const verifyEmailContBtn = document.getElementById(
							"verify-email-continue-btn",
						);
						verifyEmailContBtn?.classList.remove("hidden");
						verifyEmailContBtn?.classList.add("block");
						verifyEmailContBtn?.focus();
					})
					.catch((err) => {
						hideLoadingSpinner();
						const verifyEmailConsole = document.getElementById(
							"verify-email-console",
						);
						verifyEmailConsole?.classList.remove("hidden");
						verifyEmailConsole?.classList.add("flex");

						const verifyEmailInfo: any =
							document.getElementById("verify-email-info");
						verifyEmailInfo.textContent =
							"Error... The email link is probably expired, click the retry button to go back to login page and request a new link";
						// read email verification status for screen readers
						const emailVerStat: any =
							document.getElementById("email-verif-status");
						emailVerStat.textContent =
							"Error... The email link is probably expired, click the retry button to go back to login page and request a new link";

						const retryEmailVerifyBtn = document.getElementById(
							"verify-email-retry-btn",
						);
						retryEmailVerifyBtn?.classList.remove("hidden");
						retryEmailVerifyBtn?.classList.add("block");
						retryEmailVerifyBtn?.focus();
					});

				break;

			default:
				router.push("/login");
				break;
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="relative flex items-center justify-center min-h-[100vh] to-blue-100">
			<div
				id="email-action-console"
				className={`w-[90%] max-w-[400px] border-[1.5px] border-accent rounded-lg py-10 px-4 bg-slate-200 hidden`}>
				<div
					id="new-password-console"
					className="w-full h-full hidden">
					<label
						htmlFor="inp-password-reset"
						className={`block ${
							retryReset ? "hidden" : ""
						} ml-[10%] text-[16px] mobileL:text-[18px] mobileXL:text-[22px]`}>
						New Password
					</label>
					<div
						className={`password-host block w-[80%] p-[2px] mx-auto rounded relative bg-white overflow-hidden ${
							retryReset ? "hidden" : ""
						}`}>
						<input
							type="password"
							name="resetpassword"
							id="inp-password-reset"
							className="inline w-[85%] outline-white bg-transparent  mobileL:text-[18px] mobileXL:text-[22px]"
							onChange={(e) => {
								validatePasswordOnChange(e, "reset");
							}}
							onFocus={(e) => passwordFocusAssist("reset")}
							onBlur={(e) => passwordFocusAssist("reset")}
							required
						/>
						{/* secondary password toggle */}
						<button
							type="button"
							aria-label="password toggle"
							className="fas fa-eye ml-1 w-max h-max bg-transparent border-0"
							onClick={(e) => showHidePassword(e, "reset")}></button>
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
					{/* ----------------------------------------------------- */}
					{/* for screen readers only */}
					<p
						role="alert"
						id="reset-password-status"
						className="w-0 h-0 overflow-hidden"></p>
					<p
						role="alert"
						id="reset-password-req"
						className="w-0 h-0 overflow-hidden"></p>
					{/* ----------------------------------------------------- */}
					<button
						type="button"
						aria-label="submit"
						className={`min-w-[180px] block min-h-[46px] p-0 mt-4 mx-auto rounded-lg bg-[#4e4ec2] relative overflow-hidden ${
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
						<div
							aria-label="submit"
							className="w-[95%] bg-primary py-[2px] m-0 rounded-lg sub-btn-in absolute top-[50%] translate-y-[-52%] left-[50%] translate-x-[-50%] text-center text-white text-[16px]  mobileL:text-[18px] mobileXL:text-[22px]">
							SUBMIT
						</div>
					</button>
					<Link
						id="btn-retry-password-reset"
						href="/login"
						passHref
						className={`w-max h-max block mx-auto my-8
						 ${retryReset ? "" : "hidden"}`}>
						<button
							type="button"
							className={`min-w-[180px] min-h-[46px] p-0 rounded-lg bg-[#4e4ec2] relative overflow-hidden`}>
							<div className="w-[95%] bg-primary py-[2px] m-0 rounded-lg sub-btn-in absolute top-[50%] translate-y-[-52%] left-[50%] translate-x-[-50%] text-center text-white text-[16px]  mobileL:text-[18px] mobileXL:text-[22px]">
								RETRY
							</div>
						</button>
					</Link>
				</div>
				{/* email veriffication layout */}
				<div
					id="verify-email-console"
					className="w-full h-full hidden justify-center items-center flex-col">
					<p
						id="verify-email-info"
						className="mx-2 text-center text-slate-700 font-specialElite">
						Your email has been verified, click continue to proceed
					</p>
					<Link
						href={continueURLState}
						className="w-max px-10 py-[1px] bg-accent hover:bg-primary text-white hover:text-secondary ring-2 ring-gray-400 mx-auto my-8 rounded-xl text-[18px] hidden"
						id="verify-email-continue-btn">
						Continue
					</Link>
					<Link
						href="/request_email_verification"
						className="w-max px-10 py-[1px] bg-accent hover:bg-primary text-white hover:text-secondary ring-2 ring-gray-400 mx-auto my-8 rounded-xl text-[18px] hidden"
						id="verify-email-retry-btn">
						Retry
					</Link>
					{/* for screen readers only */}
					<p
						role="alert"
						id="email-verif-status"
						className="w-0 h-0 overflow-hidden"></p>
				</div>
			</div>
			<BallSpinnerModal />
		</div>
	);
};

export default PasswordReset;

import BallSpinnerModal from "@/components/BallSpinners";
import {
	passwordFocusAssist,
	showHidePassword,
} from "@/myFunctions/passwordToggle";
import createUserAccount, {
	checkSignUpPasswordMatch,
} from "@/myFunctions/userSignUp";
import { validatePasswordOnChange } from "@/myFunctions/validatePassword";
import { useEffect } from "react";
import { appAuth } from "@/firebase.config";
import { useRouter } from "next/router";
import { onAuthStateChanged, signOut } from "firebase/auth";

const SignIn = () => {
	const router = useRouter();
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(appAuth, (user) => {
			// refresh user authentication data
			user?.reload();

			// if user is signed in check the user email verification status
			if (user) {
				// if user is verified check if the user has set display name, if the user email is not verified redirect user to request_email_verification page
				if (user.emailVerified) {
					// if user has set a display name redirect the user to quizroom else redirect the user to signup_2 page to set a display name
					if (user.displayName) {
						router.push("/quizroom");
					} else {
						router.push("/signup_2");
					}
				}
			} else {
				// annouce page name with screen reader
				const pageNameLogin: any = document.getElementById("page-name-SR");
				pageNameLogin.textContent = "Create Account";
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="signup-root min-h-[100vh] overflow-y-auto relative bg-slate-200">
			<div className="flex items-center justify-center py-3">
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src="/brand.png"
					alt="brand quizzical"
					className="img-signup-brand w-[30%] max-w-[215px] min-w-[130px] h-auto object-cover"
				/>
			</div>
			<p
				tabIndex={1}
				className="text-center my-1 text-primary font-bold text-[18px] mobileL:text-[23px] mobileXL:text-[29px] font-julee w-max mx-auto">
				Create Account
			</p>
			<div className="signup-form-root w-full max-w-[400px] mx-auto">
				<form
					className="flex flex-col items-center w-full"
					onSubmit={(e) => {
						e.preventDefault();
						createUserAccount();
					}}>
					<div className=" w-full mt-4">
						<label
							htmlFor="#inp-email-signup"
							className="w-[80%] block text-[16px] mobileL:text-[18px] mobileXL:text-[22px] mx-auto">
							Email
						</label>
						<input
							type="email"
							name="signupemail"
							id="inp-email-signup"
							placeholder="name@domain.com"
							className="block mx-auto w-[80%] p-[2px] rounded mobileL:text-[18px] mobileXL:text-[22px]"
							autoComplete="email"
							required
						/>
						<p
							role="alert"
							id="email-error-signup"
							className="mt-2 text-red-600 text-[10px] mobileL:text-[14px] mobileXL:text-[17px] w-[80%] hidden mx-auto"></p>
					</div>
					<div className=" w-full mt-6">
						<label
							htmlFor="inp-password-signup"
							className="w-[80%] block text-[16px] mobileL:text-[18px] mobileXL:text-[22px] mx-auto">
							Password
						</label>
						<div className="password-host block w-[80%] p-[2px] mx-auto rounded relative bg-white overflow-hidden">
							<input
								type="password"
								name="signuppassword"
								id="inp-password-signup"
								className="inline w-[90%] outline-white bg-transparent mobileL:text-[18px] mobileXL:text-[22px]"
								onChange={(e) => {
									validatePasswordOnChange(e, "signup");
								}}
								onFocus={(e) => passwordFocusAssist("signup")}
								onBlur={(e) => passwordFocusAssist("signup")}
								required
							/>
							{/* secondary password toggle */}
							<button
								type="button"
								aria-label="password toggle"
								className="fas fa-eye ml-1 w-max h-max bg-transparent border-0"
								onClick={(e) => showHidePassword(e, "signup")}></button>
						</div>
						<div
							id="password-check-signup"
							className="text-[12px] hidden w-[80%] mx-auto">
							<p>at least...</p>
							<p className="pw-letter-check-ok-signup text-green-500 hidden">
								6 letters. <i className="fas fa-check"></i>
							</p>
							<p className="pw-letter-check-bad-signup text-red-500 hidden">
								6 letters. <i className="fas fa-xmark"></i>
							</p>
							<p className="pw-num-check-ok-signup text-green-500 hidden">
								1 number. <i className="fas fa-check"></i>
							</p>
							<p className="pw-num-check-bad-signup text-red-500 hidden">
								1 number. <i className="fas fa-xmark"></i>
							</p>
							<p className="pw-non-alphanum-check-ok-signup text-green-500 hidden">
								1 non-alphanumeric character. <i className="fas fa-check"></i>
							</p>
							<p className="pw-non-alphanum-check-bad-signup text-red-500 hidden">
								1 non-alphanumeric character. <i className="fas fa-xmark"></i>
							</p>
						</div>
						<label
							htmlFor="inp-confirm-password-signup"
							className="w-[80%] block text-[16px] mobileL:text-[18px] mobileXL:text-[22px] mx-auto">
							Confirm Password
						</label>
						<div className="password-host block w-[80%] p-[2px] mx-auto rounded relative bg-white overflow-hidden">
							<input
								type="password"
								name="signuppasswordconfirm"
								id="inp-confirm-password-signup"
								className="inline w-[90%] outline-white bg-transparent mobileL:text-[18px] mobileXL:text-[22px]"
								onChange={checkSignUpPasswordMatch}
								onFocus={(e) => passwordFocusAssist("signup")}
								onBlur={(e) => passwordFocusAssist("signup")}
								required
							/>
							{/* secondary password toggle */}
							<button
								type="button"
								aria-label="confirm password toggle"
								className="fas fa-eye ml-1 w-max h-max bg-transparent border-0"
								onClick={(e) => showHidePassword(e, "signup")}></button>
						</div>
						{/* ------------------------------------------------------------------- */}
						{/* for screen readers only */}
						<p
							role="alert"
							id="page-name-SR"
							className="w-0 h-0 overflow-hidden"></p>
						<p
							role="alert"
							id="signup-password-status"
							className="w-0 h-0 overflow-hidden"></p>
						<p
							role="alert"
							id="signup-password-req"
							className="w-0 h-0 overflow-hidden"></p>
						{/* ------------------------------------------------------------------- */}
					</div>
					<p
						role="alert"
						id="signup-error-console"
						className="w-[80%] text-center text-[10px] mobileL:text-[14px] mobileXL:text-[18px] p-2 mt-5 rounded-md hidden"></p>
					<button
						type="submit"
						className=" min-w-[180px] min-h-[46px] p-0 mt-4 rounded-lg bg-[#4e4ec2] relative overflow-hidden">
						<div className="w-[95%] bg-primary py-[2px] m-0 rounded-lg sub-btn-in absolute top-[50%] translate-y-[-52%] left-[50%] translate-x-[-50%] text-center text-white text-[16px]  mobileL:text-[18px] mobileXL:text-[22px]">
							SUBMIT
						</div>
					</button>
				</form>
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

export default SignIn;

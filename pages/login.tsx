/* eslint-disable react-hooks/exhaustive-deps */
import BallSpinnerModal from "@/components/BallSpinners";
import { appAuth } from "@/firebase.config";
import { handelForgotPassword } from "@/myFunctions/forgotPassword";
import {
	passwordFocusAssist,
	showHidePassword,
} from "@/myFunctions/passwordToggle";
import initiateLoginProcess from "@/myFunctions/startLogin";
import { validatePasswordOnChange } from "@/myFunctions/validatePassword";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

/* eslint-disable @next/next/no-img-element */
const Login = () => {
	const router = useRouter();
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(appAuth, (user) => {
			if (user) {
				console.log(user.emailVerified);

				if (user.emailVerified) {
					router.push("/quizroom");
				} else {
					router.push("/request_email_verification");
				}
			}
		});

		const pageNameLogin: any = document.getElementById("page-name-SR");
		pageNameLogin.textContent = "Login";

		return () => {
			unsubscribe();
		};
	}, []);

	return (
		<div className="login-root min-h-[100vh] overflow-y-auto relative bg-slate-200">
			<div className="flex items-center justify-center py-3">
				<img
					src="/brand.png"
					alt="brand quizzical"
					className="img-login-brand w-[30%] max-w-[215px] min-w-[130px] h-auto object-cover"
				/>
			</div>
			<p
				tabIndex={1}
				className="text-center my-1 text-primary font-bold text-[18px] mobileL:text-[23px] mobileXL:text-[29px] font-julee w-max mx-auto">
				Login
			</p>
			<div className="login-form-root w-full max-w-[400px] mx-auto">
				<form
					className="flex flex-col items-center w-full"
					onSubmit={(e) => {
						e.preventDefault();
						initiateLoginProcess(router);
					}}>
					<div className=" w-full mt-4">
						<label
							htmlFor="inp-email-login"
							className="w-[80%] block text-[16px] mobileL:text-[18px] mobileXL:text-[22px] mx-auto">
							Email
						</label>
						<input
							type="email"
							name="loginemail"
							id="inp-email-login"
							placeholder="name@domain.com"
							className="block mx-auto w-[80%] rounded p-[2px] mobileL:text-[18px] mobileXL:text-[22px]"
							autoComplete="email"
							required
						/>
					</div>
					<div className=" w-full mt-6">
						<label
							htmlFor="inp-password-login"
							className="w-[80%] block text-[16px] mobileL:text-[18px] mobileXL:text-[22px] mx-auto">
							Password
						</label>
						<div className="password-host block w-[80%] p-[2px] mx-auto rounded relative bg-white overflow-hidden">
							<input
								type="password"
								name="loginpassword"
								id="inp-password-login"
								className="inline w-[90%] outline-white bg-transparent mobileL:text-[18px] mobileXL:text-[22px]"
								onChange={(e) => {
									validatePasswordOnChange(e, "login");
								}}
								onFocus={(e) => passwordFocusAssist("login")}
								onBlur={(e) => passwordFocusAssist("login")}
								required
							/>
							{/* secondary password toggle */}
							<button
								type="button"
								aria-label="password toggle"
								className="fas fa-eye ml-1 w-max h-max bg-transparent border-0"
								onClick={(e) => showHidePassword(e, "login")}></button>
						</div>
						{/* ----------------------------------------------------- */}
						{/* for screen readers only */}
						<p
							role="alert"
							id="page-name-SR"
							className="w-0 h-0 overflow-hidden"></p>
						<p
							role="alert"
							id="login-password-status"
							className="w-0 h-0 overflow-hidden"></p>
						<p
							role="alert"
							id="login-password-req"
							className="w-0 h-0 overflow-hidden"></p>
						{/* ----------------------------------------------------- */}

						<div
							id="password-check-login"
							className="text-[10px] mobileL:text-[14px] mobileXL:text-[17px] hidden w-[80%] mx-auto">
							<p>at least...</p>
							<p className="pw-letter-check-ok-login text-green-500 hidden">
								6 letters. <i className="fas fa-check"></i>
							</p>
							<p className="pw-letter-check-bad-login text-red-500 hidden">
								6 letters. <i className="fas fa-xmark"></i>
							</p>
							<p className="pw-num-check-ok-login text-green-500 hidden">
								1 number. <i className="fas fa-check"></i>
							</p>
							<p className="pw-num-check-bad-login text-red-500 hidden">
								1 number. <i className="fas fa-xmark"></i>
							</p>
							<p className="pw-non-alphanum-check-ok-login text-green-500 hidden">
								1 non-alphanumeric character. <i className="fas fa-check"></i>
							</p>
							<p className="pw-non-alphanum-check-bad-login text-red-500 hidden">
								1 non-alphanumeric character. <i className="fas fa-xmark"></i>
							</p>
						</div>
						<button
							type="button"
							className="w-max h-max mt-1 ml-[10%] text-[12px] mobileL:text-[14px] mobileXL:text-[18px] text-accent hover:text-red-600 cursor-pointer bg-transparent border-0 p-0"
							onClick={(e) => {
								handelForgotPassword();
							}}>
							Forgot Password?
						</button>
					</div>

					<button
						type="submit"
						className=" min-w-[180px] min-h-[46px] p-0 mt-4 rounded-lg bg-[#4e4ec2] relative overflow-hidden">
						<div className="w-[95%] bg-primary py-[2px] m-0 rounded-lg sub-btn-in absolute top-[50%] translate-y-[-52%] left-[50%] translate-x-[-50%] text-center text-white text-[16px]  mobileL:text-[18px] mobileXL:text-[22px]">
							SUBMIT
						</div>
					</button>
					<p
						role="alert"
						id="login-error-console"
						className="w-[80%] text-center text-[10px] mobileL:text-[14px] mobileXL:text-[18px] p-2 mt-3 rounded-md ring-1 hidden"></p>
				</form>
			</div>
			<p
				id="no-acct"
				tabIndex={0}
				className="text-[14] mobileL:text-[18px] mobileXL:text-[22px] text-center absolute bottom-12 tallS:bottom-16 laptopS:!bottom-3 invisible short:visible w-max max-h-max left-[50%] translate-x-[-50%]">
				Don`t have an account...?{" "}
				<Link
					href="/signup"
					className=" text-blue-600">
					Sign Up
				</Link>
			</p>
			<BallSpinnerModal />
		</div>
	);
};

export default Login;

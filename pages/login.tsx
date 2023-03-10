import BallSpinnerModal from "@/components/BallSpinners";
import { appAuth } from "@/firebase.config";
import { handelForgotPassword } from "@/myFunctions/forgoPassword";
import {
	passwordIsBlur,
	passwordIsFocused,
	showHidePassword,
} from "@/myFunctions/passwordFocus";
import initiateLoginProcess from "@/myFunctions/startLogin";
import { validatePasswordOnChange } from "@/myFunctions/validatePassword";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

/* eslint-disable @next/next/no-img-element */
const Login = () => {
	const router = useRouter();
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(appAuth, (user) => {
			console.log(user);
			if (user) {
				//router.push("/quizroom");
			}
		});

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
			<p className="text-center my-1 text-primary font-bold text-[21px] font-julee">
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
							htmlFor="#inp-email-login"
							className="w-[80%] block text-[17px] mx-auto">
							Email
						</label>
						<input
							type="email"
							name="loginemail"
							id="inp-email-login"
							className=" block mx-auto border-2 w-[80%] rounded-lg ring-1 ring-slate-600 outline-accent"
							autoComplete="email"
							required
						/>
					</div>
					<div className=" w-full mt-6">
						<label
							htmlFor="#inp-password-login"
							className="w-[80%] block text-[17px] mx-auto">
							Password
						</label>
						<div className=" block w-[80%] p-[1px] mx-auto rounded-lg border-2 ring-1 ring-slate-600 relative bg-white overflow-hidden">
							<input
								type="password"
								name="loginpassword"
								id="inp-password-login"
								className="inline w-[90%] outline-white bg-transparent"
								onChange={(e) => {
									validatePasswordOnChange(e, "login");
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
							id="password-check-login"
							className="text-[12px] hidden w-[80%] mx-auto">
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
						<p
							className="w-max mt-1 ml-[10%] text-sm text-accent hover:text-red-600 cursor-pointer"
							onClick={(e) => {
								handelForgotPassword();
							}}>
							Forgot Password?
						</p>
					</div>

					<button
						type="submit"
						className="px-8 py-[2px] mt-8 rounded-lg bg-primary ring-2 ring-secondary text-white text-[18px]">
						Login
					</button>
					<p
						id="login-error-console"
						className="w-[80%] text-center text-red-600 text-[12px] bg-red-200 p-2 mt-5 rounded-md ring-1 ring-red-400 hidden">
						There was an error while processing your data please check your
						network and try again.
					</p>
				</form>
			</div>
			<p className="text-[18] w-full text-center absolute bottom-2">
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

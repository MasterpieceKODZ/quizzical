import BallSpinnerModal from "@/components/BallSpinners";
import { appAuth } from "@/firebase.config";
import { handelForgotPassword } from "@/myFunctions/forgoPassword";
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
					className="img-login-brand w-[30%] h-auto object-cover"
				/>
			</div>
			<div className="login-form-root">
				<form
					className="flex flex-col items-center"
					onSubmit={(e) => {
						e.preventDefault();
						initiateLoginProcess();
					}}>
					<div className=" w-max mt-4">
						<label
							htmlFor="#inp-email-login"
							className="block text-[17px] ">
							Email
						</label>
						<input
							type="email"
							name="loginemail"
							id="inp-email-login"
							className=" block border-2 w-[80vw] rounded-lg ring-1 ring-slate-600 outline-accent"
							autoComplete="email"
							required
						/>
						<p
							id="email-error-login"
							className="mt-2 text-red-600 text-[12px] w-[80vw] hidden">
							this email address is not valid please enter a valid address and
							try again
						</p>
					</div>
					<div className=" w-max mt-6">
						<label
							htmlFor="#inp-password-login"
							className="block text-[17px]">
							Password
						</label>
						<input
							type="password"
							name="loginpassword"
							id="inp-password-login"
							className=" block border-2 w-[80vw] rounded-lg ring-1 ring-slate-600  outline-accent"
							autoComplete="current-password"
							onChange={(e) => {
								validatePasswordOnChange(e, "login");
							}}
							required
						/>
						<div
							id="password-check-login"
							className="text-[12px] hidden">
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
							className=" w-max mt-1 text-sm text-accent hover:text-red-600 cursor-pointer"
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
			<button
				className="absolute top-2 left-1"
				onClick={(e) => {
					signOut(appAuth);
				}}>
				SIGN OUT
			</button>
			<BallSpinnerModal />
		</div>
	);
};

export default Login;

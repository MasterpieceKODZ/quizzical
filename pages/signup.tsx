import BallSpinnerModal from "@/components/BallSpinners";
import {
	passwordIsBlur,
	passwordIsFocused,
	showHidePassword,
} from "@/myFunctions/passwordFocus";
import createUserAccount, {
	checkSignUpPasswordMatch,
} from "@/myFunctions/userSignUp";
import { validatePasswordOnChange } from "@/myFunctions/validatePassword";

const SignIn = () => {
	return (
		<div className="login-root min-h-[100vh] overflow-y-auto relative bg-slate-200">
			<div className="flex items-center justify-center py-3">
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src="/brand.png"
					alt="brand quizzical"
					className="img-signup-brand w-[30%] max-w-[215px] min-w-[130px] h-auto object-cover"
				/>
			</div>
			<p className="text-center my-1 text-primary font-bold text-[18px] font-julee">
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
							className="w-[80%] block text-[17px] mx-auto">
							Email
						</label>
						<input
							type="email"
							name="signupemail"
							id="inp-email-signup"
							className=" block mx-auto border-2 w-[80%] rounded-lg ring-1 ring-slate-600 outline-accent"
							autoComplete="email"
							required
						/>
						<p
							id="email-error-signup"
							className="mt-2 text-red-600 text-[12px] w-[80%] hidden mx-auto">
							this email address is not valid please enter a valid address and
							try again
						</p>
					</div>
					<div className=" w-full mt-6">
						<label
							htmlFor="#inp-password-signup"
							className="w-[80%] block text-[17px] mx-auto">
							Password
						</label>
						<div className=" block w-[80%] p-[1px] mx-auto rounded-lg border-2 ring-1 ring-slate-600 relative bg-white overflow-hidden">
							<input
								type="password"
								name="signuppassword"
								id="inp-password-signup"
								className="inline w-[90%] outline-white bg-transparent"
								onChange={(e) => {
									validatePasswordOnChange(e, "signup");
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
						{/* <input
							type="password"
							name="signuppassword"
							id="inp-password-signup"
							className=" block mx-auto border-2 w-[80%] rounded-lg ring-1 ring-slate-600  outline-accent"
							onChange={(e) => {
								validatePasswordOnChange(e, "signup");
							}}
							required
						/> */}
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
							htmlFor="#inp-confirm-password-signup"
							className="w-[80%] block text-[17px] mx-auto">
							Confirm Password
						</label>
						<div className=" block w-[80%] p-[1px] mx-auto rounded-lg border-2 ring-1 ring-slate-600 relative bg-white overflow-hidden">
							<input
								type="password"
								name="signuppasswordconfirm"
								id="inp-confirm-password-signup"
								className="inline w-[90%] outline-white bg-transparent"
								onChange={checkSignUpPasswordMatch}
								onFocus={(e) => passwordIsFocused(e)}
								onBlur={(e) => passwordIsBlur(e)}
								required
							/>
							{/* secondary password toggle */}
							<i
								className="fas fa-eye ml-1"
								onClick={(e) => showHidePassword(e)}></i>
						</div>
						{/* <input
							type="password"
							name="signuppassword"
							id="inp-confirm-password-signup"
							className=" block mx-auto border-2 w-[80%] rounded-lg ring-1 ring-slate-600  outline-accent"
							onChange={checkSignUpPasswordMatch}
							required
						/> */}
					</div>
					<p
						id="signup-error-console"
						className="w-[80%] text-center text-red-600 text-[12px] bg-red-200 p-2 mt-5 rounded-md ring-1 ring-red-400 hidden">
						There was an error while processing your data please check your
						network and try again.
					</p>

					<button
						type="submit"
						className="px-8 py-[2px] mt-8 rounded-lg bg-primary ring-2 ring-secondary text-white text-[18px]">
						Submit
					</button>
				</form>
			</div>
			<BallSpinnerModal />
		</div>
	);
};

export default SignIn;

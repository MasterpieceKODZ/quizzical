/* eslint-disable react-hooks/exhaustive-deps */
import { sendEmailVerification, signOut } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useEffect } from "react";
import { appAuth } from "@/firebase.config";
import { useRouter } from "next/router";

const Login = () => {
	const router = useRouter();

	const loginFunction = () => {
		const emailInp: any = document.getElementById("email_inp_login");
		const passwordInp: any = document.getElementById("inp_password_login");

		createUserWithEmailAndPassword(
			appAuth,
			emailInp?.value as string,
			passwordInp?.value as string,
		).then((userData) => {
			const actionCodeSetting = {
				url: "http://localhost:3000/quizroom",
				handleCodeInApp: false,
			};

			if (userData.operationType == "signIn" && !userData.user.emailVerified) {
				sendEmailVerification(userData.user, actionCodeSetting).then(() => {
					console.log("verification email sent...");
				});
			} else {
				router.push("/quizroom");
			}
		});
	};

	useEffect(() => {
		const unsubscribe = appAuth.onAuthStateChanged((user) => {
			console.log(appAuth.currentUser);

			console.log(user?.emailVerified);
		});

		return () => {
			unsubscribe();
		};
	}, []);

	return (
		<div>
			Login
			<input
				type="email"
				id="email_inp_login"
				placeholder="email"
			/>
			<input
				type="password"
				id="inp_password_login"
				placeholder="password"
			/>
			<button onClick={loginFunction}>LOGIN</button>
			<button
				onClick={() => {
					signOut(appAuth)
						.then(() => {
							console.log("user signed out...");
						})
						.catch((err) => {
							console.log("an error occured ", err);
						});
				}}>
				Sign Out
			</button>
		</div>
	);
};

export default Login;

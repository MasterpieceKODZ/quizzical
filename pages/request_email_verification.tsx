import { appAuth } from "@/firebase.config";
import { onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect } from "react";
const RequestEmailVerify = () => {
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
				} else {
					document.getElementById("retry-btn")?.focus();
				}
			} else {
				router.push("/login");
			}
		});

		return () => {
			unsubscribe();
		};
	}, []);
	return (
		<div className="w-[100vw] h-[100vh] flex justify-center items-center bg-blue-100">
			<div className="w-[90%] max-w-[400px] border-[1.5px] flex justify-center items-center border-accent rounded-lg py-10 px-4 bg-slate-200 flex-col">
				<p
					id="email-link-status"
					role="alert"
					className=" mx-2 text-center text-slate-700 font-specialElite"></p>
				<button
					id="retry-btn"
					type="button"
					className=" min-w-[180px] min-h-[46px] p-0 mt-4 rounded-lg bg-[#4e4ec2] relative overflow-hidden"
					onClick={(e) => {
						// send new verification email link
						const user = appAuth.currentUser;
						if (user) {
							sendEmailVerification(user, {
								url: "http://localhost:3000/signup_2",
							})
								.then((res) => {
									const eLinkStat: any =
										document.getElementById("email-link-status");
									eLinkStat.textContent = `an email verification link has been sent to ${user.email}, verify your email address to proceed.`;
								})
								.catch((err: Error) => {
									if (
										err.message == "Firebase: Error (auth/too-many-requests)."
									) {
										const eLinkStat: any =
											document.getElementById("email-link-status");
										eLinkStat.textContent =
											"An email verification link has already been sent to this email address, check your mailbox for the message.";
									} else {
										alert(
											"An error occured while trying to send the email verification link, check your network and try again",
										);
									}
								});
						} else {
							alert(
								"There is no account signed in on this device,please login or create an account",
							);
							router.push("/login");
						}
					}}>
					<div className="w-[95%] bg-primary py-[2px] m-0 rounded-lg sub-btn-in absolute top-[50%] translate-y-[-52%] left-[50%] translate-x-[-50%] text-center text-white text-[16px]  mobileL:text-[18px] mobileXL:text-[22px]">
						Resend Email
					</div>
				</button>
			</div>
		</div>
	);
};

export default RequestEmailVerify;

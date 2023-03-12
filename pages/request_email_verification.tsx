import { appAuth } from "@/firebase.config";
import { sendEmailVerification } from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect } from "react";
const RequestEmailVerify = () => {
	const router = useRouter();
	useEffect(() => {
		const user = appAuth.currentUser;

		if (user) {
			if (user.emailVerified) {
				router.push("/quizroom");
			}
		} else {
			alert("please login first before requesting email verification.");
			router.push("/login");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<div className="w-[100vw] h-[100vh] flex justify-center items-center bg-blue-100">
			<div className="w-[90%] max-w-[400px] border-[1.5px] flex justify-center items-center border-accent rounded-lg py-10 px-4 bg-slate-200 flex-col">
				<p
					id="email-link-status"
					role="alert"
					className=" mx-2 text-center text-slate-700 font-specialElite">
					You must verify your email address to continue, click the button below
					to get an email verification link
				</p>
				<button
					type="button"
					className=" min-w-[180px] min-h-[46px] p-0 mt-4 rounded-lg bg-[#4e4ec2] relative overflow-hidden"
					onClick={(e) => {
						// send new verification email link
						const user = appAuth.currentUser;
						if (user) {
							sendEmailVerification(user, { url: "/signup_2" })
								.then((res) => {
									const eLinkStat: any =
										document.getElementById("email-link-status");
									eLinkStat.textContent = `an email verification link has been sent to ${user.email}, verify your email address to proceed.`;
								})
								.catch((err) => {
									alert(
										"An error occured while trying to send the email verification link, check your network and try again",
									);
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

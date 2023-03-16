/* eslint-disable react-hooks/exhaustive-deps */
import { actionUpdateWelcomeText } from "@/redux/actionCreators";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect } from "react";
import { getChallengeText } from "../challenge";
import { actionUpdateChallengeText } from "../redux/actionCreators";
//import { appAuth } from "../firebase.config";
import { useRouter } from "next/router";
import { appAuth } from "@/firebase.config";

const Welcome = () => {
	const welcomeText = useAppSelector((state) => state.appState.welcomeText);
	const challengeText = useAppSelector((state) => state.appState.challengeText);
	const dispatch: any = useAppDispatch();
	const router = useRouter();

	useEffect(() => {
		const brandImg = document.getElementById("img-app-name");
		const btnAcceptChallenge = document.getElementById("btn-accept-challenge");

		// start welcome animation
		let joinedWelcomeText = "";

		const welcomeTextArray = "WELCOME TO".split("");

		welcomeTextArray.forEach((char: any, index: number) => {
			setTimeout(() => {
				joinedWelcomeText = joinedWelcomeText + char;

				dispatch(actionUpdateWelcomeText(joinedWelcomeText));
			}, index * 170);
		});

		// read welcome message for - screen readers
		const welTxtSR: any = document.getElementById("welcome-text-SR");
		welTxtSR.textContent = "welcome to quizzical";

		// show app name, drop down animation
		setTimeout(() => {
			brandImg?.classList.add("app-brand-img");

			// write challenge text
			brandImg?.addEventListener(
				"animationend",
				(e) => {
					let joinedChallengeText = "";

					const challengeTextArray = getChallengeText();

					// read challenge message for - screen readers
					const chalMsg: any = document.getElementById("challenge-text-SR");
					chalMsg.textContent = challengeTextArray.join("");

					challengeTextArray.forEach((char: any, index: number) => {
						setTimeout(() => {
							joinedChallengeText = joinedChallengeText + char;

							dispatch(actionUpdateChallengeText(joinedChallengeText));

							// show accept challenge button when chanllenge text has been written completely
							if (index == challengeTextArray.length - 1) {
								btnAcceptChallenge?.classList.remove("invisible");
								btnAcceptChallenge?.classList.add("visible");
								setTimeout(() => {
									btnAcceptChallenge?.focus();
								}, 1000);
							}
						}, index * 60);
					});
				},
				false,
			);
		}, welcomeTextArray.length * 180);

		return () => {
			brandImg?.classList.remove("app-brand-img");
			dispatch(actionUpdateWelcomeText(""));
			dispatch(actionUpdateChallengeText(""));
			btnAcceptChallenge?.classList.remove("visible");
			btnAcceptChallenge?.classList.add("invisible");
		};
	}, []);

	const acceptChallenge = () => {
		const user = appAuth.currentUser;

		// if the user is signed in, navigate to quizroom else show login screen
		if (user) {
			if (user.emailVerified) {
				if (user.displayName) {
					router.push("/quizroom");
				} else {
					router.push("/signup_2");
				}
			} else {
				router.push("/request_email_verification");
			}
		} else {
			router.push("/login");
		}
	};

	return (
		<div className="w-[100vw] h-[100vh] max-w-[100vw] max-h-[100vh] p-1 overflow-hidden bg-blue-500 flex justify-center items-center flex-col">
			<p
				id="welcome-text-p"
				className="font-newRocker text-center text-[length:22px] tabM:text-[length:26px] text-primary mt-3 welcome-text">
				{welcomeText}
			</p>
			<div className="w-full h-[100px] tabM:h-[150px] mb-4 p-2 bg-transparent relative overflow-hidden">
				{/*eslint-disable-next-line @next/next/no-img-element*/}
				<img
					id="img-app-name"
					src="/brand.png"
					alt="quizzical"
					className=" w-auto h-[60px] tabM:h-[80px] absolute bottom-[110%] left-[50%] translate-x-[-50%]"
				/>
			</div>
			<div className="w-[280px] h-[232px] mobileL:w-[350px] tabM:w-[450px] max-w-[500px] max-h-[400px] bg-[#010029] mx-auto p-2 rounded-xl overflow-x-hidden overflow-y-scroll challenge-monitor">
				<p
					id="challenge-text"
					className=" font-specialElite text-lime-600 text-[16px]">
					{challengeText}
				</p>
			</div>
			<button
				id="btn-accept-challenge"
				className="block px-5 py-[2px] mx-auto my-3 tallXS:mt-[28px] bg-secondary text-primary text-[18px] font-bold font-stylish border-primary border-2 rounded-lg invisible"
				onClick={acceptChallenge}>
				ACCEPT CHALLENGE
			</button>
			{/* for screen readerss only */}
			<p
				role="alert"
				className="h-0 w-0 overflow-hidden"
				id="welcome-text-SR"></p>
			<p
				role="alert"
				className="h-0 w-0 overflow-hidden"
				id="challenge-text-SR"></p>
		</div>
	);
};

export default Welcome;

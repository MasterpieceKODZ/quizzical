/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import Image from "next/image";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { actionUpdateDeveloperName } from "@/redux/actionCreators";
import { useRouter } from "next/router";

export default function Home() {
	const devName = useAppSelector((state) => state.appState.devName);
	const dispatch: any = useAppDispatch();
	const router = useRouter();

	useEffect(() => {
		const modal = document.getElementById("welcome-screen-modal");
		const devLogo = document.getElementById("developer-logo");

		console.log("webpage loaded");

		// animate developer logo
		setTimeout(() => {
			modal?.classList.add("welcome-modal");
			devLogo?.classList.add("dev-logo");
		}, 50);

		// write developer name
		setTimeout(() => {
			let joinedDevName = "";

			const devNameArray = "MASTERPIECE-KODZ".split("");

			devNameArray.forEach((char: any, index: number) => {
				setTimeout(() => {
					joinedDevName = joinedDevName + char;

					dispatch(actionUpdateDeveloperName(joinedDevName));

					// navigate to welcome page after writing developer name
					if (index == devNameArray.length - 1) {
						setTimeout(() => {
							router.push("/welcome");
						}, 1500);
					}
				}, index * 300);
			});
		}, 2000);

		return () => {
			modal?.classList.remove("welcome-modal");
			devLogo?.classList.remove("dev-logo");
			dispatch(actionUpdateDeveloperName(""));
		};
	}, []);

	return (
		<div>
			<div
				id="welcome-screen-modal"
				className="h-screen bg-stone-300 transition-all ease-in duration-500 opacity-0 flex flex-col justify-center items-center relative">
				<div className={`w-min h-min`}>
					<img
						id="developer-logo"
						className={`w-[50vw] h-auto transition-all ease-in duration-700 delay-700 max-w-0 max-h-0 opacity-0`}
						src="/dev-logo.png"
						alt="developer logo masterpiece kodz"
					/>
					<div className="w-full h-full absolute top-0 left-0 bg-transparent"></div>
				</div>
				<p
					id="dev-name"
					className={`w-max min-h-[100px] ${
						/*FONT-SIZE-START*/ "text-center text-[length:23px] mobileL:text-[25px] tabS:text-[28px] tabM:text-[35px] tabL:text-[42px] laptopM:text-[50px]" /*FONT-SIZE-END*/
					} font-wallpoet dev-name`}>
					{devName}
				</p>
			</div>
		</div>
	);
}

export async function getStaticProps() {
	return {
		props: { name: "max" },
	};
}

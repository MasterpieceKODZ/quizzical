/* eslint-disable react-hooks/exhaustive-deps */
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { devNameArray } from "@/textArrays/textArrays";
import { actionUpdateDeveloperName } from "@/redux/actionCreators";

export default function Home() {
	const devName = useAppSelector((state) => state.appState.devName);
	//const [devName, setDevName] = useState("");
	const dispatch: any = useAppDispatch();

	useEffect(() => {
		const modal = document.getElementById("welcome-screen-modal");
		const devLogo = document.getElementById("developer-logo");
		//const devNameElement = document.getElementById("dev-name");

		setTimeout(() => {
			modal?.classList.add("welcome-modal");
			devLogo?.classList.add("dev-logo");
		}, 50);

		setTimeout(() => {
			let joinedDevName = "";

			devNameArray.forEach((char: any, index: number) => {
				setTimeout(() => {
					joinedDevName = joinedDevName + char;

					dispatch(actionUpdateDeveloperName(joinedDevName));
				}, index * 300);
			});
		}, 2000);
	}, []);

	return (
		<div>
			<div
				id="welcome-screen-modal"
				className="h-screen bg-stone-300 transition-all ease-in duration-500 opacity-0">
				<Image
					id="developer-logo"
					width={100}
					height={100}
					className={`w-[50%] h-auto absolute top-[40%] left-[50%] origin-center translate-x-[-50%] translate-y-[-50%] transition-all ease-in duration-700 delay-700 max-w-0 max-h-0 opacity-0`}
					src="/dev-logo.png"
					alt="developer logo masterpiece kodz"
					priority
				/>
				<p
					id="dev-name"
					className={`w-max ${
						/*FONT-SIZE-START*/ "text-center text-[length:23px] mobileL:text-[25px] tabS:text-[28px] tabM:text-[35px] tabL:text-[42px] laptopM:text-[50px]" /*FONT-SIZE-END*/
					} font-wallpoet absolute ${
						/*TOP-OFFSET-START*/ "top-[58%] mobileL:tallS:top-[53%] mobileL:tallL:top-[50%] min-[400px]:tallS:top-[70%] tabS:top-[63%] tabS:tall:top-[60%] tabM:tall:top-[66%] tabS:tallL:top-[58%] laptopS:tallS:top-[72%] laptopM:tallL:top-[67%]" /**TOP-OFFSET-END*/
					} left-[50%] origin-center translate-x-[-50%] translate-y-[-50%] dev-name`}>
					{devName}
				</p>
			</div>
		</div>
	);
}

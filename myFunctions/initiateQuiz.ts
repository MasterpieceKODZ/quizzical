import { Dispatch, SetStateAction } from "react";
import { closeInfoModal, openInfoModal } from "./openCloseQuizroomInfo";
import { updateDoc, doc, increment } from "firebase/firestore";
import { AppDB, appAuth } from "@/firebase.config";
export async function startQuiz(
	setQuestionLoading: Dispatch<SetStateAction<boolean>>,
	setQuestionInfo: Dispatch<SetStateAction<string>>,
	setQuestionLoaded: Dispatch<SetStateAction<boolean>>,
	setQuizInProgress: Dispatch<SetStateAction<boolean>>,
	category: string,
	difficulty: string,
	// --------------------------------
	setQuestionNum: Dispatch<SetStateAction<number>>,
	setActiveQuestion: Dispatch<SetStateAction<{}>>,
	setQuestionOptions: Dispatch<SetStateAction<string[]>>,
	setTimeLeft: Dispatch<SetStateAction<number>>,
	setTimeInterval: Dispatch<SetStateAction<number>>,
	userData: any,
) {
	if (category && difficulty) {
		setQuestionLoading(true);
		setQuestionInfo("");
		setQuestionLoaded(false);

		// fetch 20 questions from Trivia-API with the user specified category and difficulty level

		const res = await fetch(
			`https://the-trivia-api.com/api/questions?categories=${category}&limit=20&difficulty=${difficulty}`,
		);
		const questions = await res.json();

		if (storageAvailable()) {
			// persist questions list
			window.sessionStorage.setItem(
				"questionList",
				JSON.stringify(questions) as string,
			);
			//persist current question index on list
			window.sessionStorage.setItem("questionIndex", "0");

			//persist num of correct answers
			window.sessionStorage.setItem("numOfCorrectAnswers", "0");

			// show question
			showQuestion(
				setQuestionNum,
				setQuestionLoaded,
				setQuestionLoading,
				setQuestionOptions,
				setQuestionInfo,
				setQuizInProgress,
				setActiveQuestion,
				setTimeLeft,
				setTimeInterval,
				userData,
			);
		} else {
			setQuestionLoading(false);
			setQuestionInfo(
				"This browser appears to not support data persistence to browser storage,if you have disabled it please, enable it to use this app",
			);
			setQuestionLoaded(false);
		}
	} else {
		setQuestionLoading(false);
		setQuestionInfo(
			"You must select a question category and difficulty level first.",
		);
		setQuestionLoaded(false);
	}
}
// present the next question
export function showQuestion(
	setQuestionNum: Dispatch<SetStateAction<number>>,
	setQuestionLoaded: Dispatch<SetStateAction<boolean>>,
	setQuestionLoading: Dispatch<SetStateAction<boolean>>,
	setQuestionOptions: Dispatch<SetStateAction<string[]>>,
	setQuestionInfo: Dispatch<SetStateAction<string>>,
	setQuizInProgress: Dispatch<SetStateAction<boolean>>,
	setActiveQuestion: Dispatch<SetStateAction<{}>>,
	setTimeLeft: Dispatch<SetStateAction<number>>,
	setTimeInterval: Dispatch<SetStateAction<number>>,
	userData: any,
) {
	setQuestionLoaded(false);
	setQuestionInfo("");
	setQuestionLoading(true);

	// fetch question list
	const questionList = JSON.parse(
		window.sessionStorage.getItem("questionList") as string,
	) as any[];

	const questionIndex = parseInt(
		window.sessionStorage.getItem("questionIndex") as string,
	);

	//persist active question
	window.sessionStorage.setItem(
		"activeQuestion",
		JSON.stringify(
			questionList[questionIndex == 0 ? questionIndex : questionIndex - 1],
		),
	);
	setActiveQuestion(
		questionList[questionIndex == 0 ? questionIndex : questionIndex - 1],
	);

	// arrange options randomly
	let options = [
		...questionList[questionIndex == 0 ? questionIndex : questionIndex - 1]
			.incorrectAnswers,
	];

	const randNum = Math.floor(Math.random() * 4);

	if (randNum !== 3) {
		options.splice(
			randNum,
			0,
			questionList[questionIndex == 0 ? questionIndex : questionIndex - 1]
				.correctAnswer,
		);
	} else {
		options = [
			...questionList[questionIndex == 0 ? questionIndex : questionIndex - 1]
				.incorrectAnswers,
			,
			questionList[questionIndex == 0 ? questionIndex : questionIndex - 1]
				.correctAnswer,
		];
	}

	setQuestionOptions(options);

	setQuestionNum(questionIndex == 0 ? questionIndex + 1 : questionIndex);

	// upadate questionIndex in session storage
	window.sessionStorage.setItem(
		"questionIndex",
		questionIndex === 0 ? `${questionIndex + 1}` : `${questionIndex}`,
	);

	let timeInterval: any;

	const finishTimeInMills = new Date().getTime() + 21000;
	timeInterval = setInterval(() => {
		setTimeInterval(timeInterval);
		const dateNow = new Date().getTime();

		const timeInSec = Math.floor((finishTimeInMills - dateNow) / 1000);

		if (timeInSec <= 0) {
			clearInterval(timeInterval);
			NextQuestion(
				setQuestionNum,
				setActiveQuestion,
				userData,
				setQuestionInfo,
				setTimeLeft,
				setQuestionLoaded,
				setQuestionLoading,
				setQuestionOptions,
				setQuizInProgress,
				setTimeInterval,
			);
		}

		setTimeLeft(timeInSec <= 0 ? 20 : timeInSec);
	}, 1000);

	setQuestionLoading(false);
	setQuestionInfo("");
	setQuestionLoaded(true);
	setQuizInProgress(true);

	return timeInterval;
}

export function NextQuestion(
	setQuestionNum: Dispatch<SetStateAction<number>>,
	setActiveQuestion: Dispatch<SetStateAction<{}>>,
	userData: any,
	setQuestionInfo: Dispatch<SetStateAction<string>>,
	setTimeLeft: Dispatch<SetStateAction<number>>,
	setQuestionLoaded: Dispatch<SetStateAction<boolean>>,
	setQuestionLoading: Dispatch<SetStateAction<boolean>>,
	setQuestionOptions: Dispatch<SetStateAction<string[]>>,
	setQuizInProgress: Dispatch<SetStateAction<boolean>>,
	setTimeInterval: Dispatch<SetStateAction<number>>,
) {
	// reset question options

	const prevAnswer = document.querySelector(".active-option");
	prevAnswer?.classList.remove("active-option");
	gradeQuiz();

	const questionIndex = parseInt(
		window.sessionStorage.getItem("questionIndex") as string,
	);

	window.sessionStorage.setItem("optionSelected", "");
	if (questionIndex == 20) {
		finishQuiz(
			setQuestionInfo,
			setQuestionLoaded,
			setQuestionLoading,
			setQuizInProgress,
			userData,
		);
	} else if (questionIndex == 19) {
		const nextBtn: any = document.getElementById("next-btn-child");
		nextBtn.textContent = "FINISH";
		// increment question index in session storage
		window.sessionStorage.setItem("questionIndex", `${questionIndex + 1}`);
		showQuestion(
			setQuestionNum,
			setQuestionLoaded,
			setQuestionLoading,
			setQuestionOptions,
			setQuestionInfo,
			setQuizInProgress,
			setActiveQuestion,
			setTimeLeft,
			setTimeInterval,
			userData,
		);
	} else {
		// increment question index in session storage
		window.sessionStorage.setItem("questionIndex", `${questionIndex + 1}`);
		showQuestion(
			setQuestionNum,
			setQuestionLoaded,
			setQuestionLoading,
			setQuestionOptions,
			setQuestionInfo,
			setQuizInProgress,
			setActiveQuestion,
			setTimeLeft,
			setTimeInterval,
			userData,
		);
	}
}

export function gradeQuiz() {
	// fetch active question
	const activeQuestion = JSON.parse(
		window.sessionStorage.getItem("activeQuestion") as string,
	);
	// fetch option selected by user
	const optionSelected = window.sessionStorage.getItem("optionSelected");
	// fetch number of correct answers
	const numOfCorrectAnswers = parseInt(
		window.sessionStorage.getItem("numOfCorrectAnswers") as string,
	);
	if (optionSelected == activeQuestion.correctAnswer) {
		// increment numOfCorrectAnswers in session storage
		window.sessionStorage.setItem(
			"numOfCorrectAnswers",
			`${numOfCorrectAnswers + 1}`,
		);
	}
}

export function finishQuiz(
	setQuestionInfo: Dispatch<SetStateAction<string>>,
	setQuestionLoaded: Dispatch<SetStateAction<boolean>>,
	setQuestionLoading: Dispatch<SetStateAction<boolean>>,
	setQuizInProgress: Dispatch<SetStateAction<boolean>>,
	userData: any,
) {
	setQuizInProgress(false);
	setQuestionInfo("You made it through!!!");
	setQuestionLoaded(false);
	setQuestionLoading(false);

	// fetch numOfCorrectAnswers from sessionStorage
	const numOfCorrectAnswers = parseInt(
		window.sessionStorage.getItem("numOfCorrectAnswers") as string,
	);

	const gamerank = Math.floor(numOfCorrectAnswers / 5);

	if (numOfCorrectAnswers > userData.highscore && numOfCorrectAnswers != 20) {
		openInfoModal(
			"Congratulations!!!",
			`You have a new highscore, \n You got ${numOfCorrectAnswers} of 20, better luck next time..`,
			"info",
		);

		// update user high score
		updateDoc(doc(AppDB, "users", appAuth.currentUser?.uid as string), {
			highscore: numOfCorrectAnswers,
		}).catch((e) => {
			openInfoModal(
				"",
				"we could save your new highscore to the server, check your network and reload the page to to save game result",
				"error",
			);

			setTimeout(() => {
				closeInfoModal();
			}, 5000);

			window.localStorage.setItem(
				`${appAuth.currentUser?.uid as string}Highscore`,
				`${numOfCorrectAnswers}`,
			);
		});
	} else if (
		numOfCorrectAnswers > userData.highscore &&
		numOfCorrectAnswers == 20
	) {
		openInfoModal(
			"Salute!!!",
			`You rose to the challenge, \n You got ${numOfCorrectAnswers} of 20. Hail Grand-Master ${userData.username}!!!`,
			"info",
		);

		// update user high score
		updateDoc(doc(AppDB, "users", appAuth.currentUser?.uid as string), {
			highscore: numOfCorrectAnswers,
		}).catch((e) => {
			openInfoModal(
				"",
				"we could not save your new highscore to the server, check your network and reload the page to save game result, this data will be lost if you play another game without saving it.",
				"error",
			);
			setTimeout(() => {
				closeInfoModal();
			}, 5000);

			window.localStorage.setItem(
				`${appAuth.currentUser?.uid as string}Highscore`,
				`${numOfCorrectAnswers}`,
			);
		});
	} else if (
		numOfCorrectAnswers == userData.highscore &&
		numOfCorrectAnswers == 20
	) {
		openInfoModal(
			"You did it again!!!",
			`You rose to the challenge, \n You got ${numOfCorrectAnswers} of 20. Hail Grand-Master ${userData.username}!!!`,
			"info",
		);
	} else if (numOfCorrectAnswers < userData.highscore) {
		openInfoModal(
			"Oh No!!!",
			`You did better last time, \n You got ${numOfCorrectAnswers} of 20, try harder next time..`,
			"info",
		);
	} else if (numOfCorrectAnswers == userData.highscore) {
		openInfoModal(
			"Good Job!!!",
			`You have the same score as last time, \n You got ${numOfCorrectAnswers} of 20, try harder next time..`,
			"info",
		);
	}

	//increment game rank
	updateDoc(doc(AppDB, "users", appAuth.currentUser?.uid as string), {
		gamerank: increment(gamerank),
	}).catch((e) => {
		openInfoModal(
			"",
			"we could not save your new highscore to the server, check your network and reload the page to save game result, this data will be lost if you play another game without saving it.",
			"error",
		);

		setTimeout(() => {
			closeInfoModal();
		}, 4000);

		window.localStorage.setItem(
			`${appAuth.currentUser?.uid as string}Gamerank`,
			`${gamerank}`,
		);
	});
}

export function storageAvailable() {
	const storage = window.sessionStorage;
	try {
		const x = "__storage_test__";
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	} catch (e) {
		return (
			e instanceof DOMException &&
			// everything except Firefox
			(e.code === 22 ||
				// Firefox
				e.code === 1014 ||
				// test name field too, because code might not be present
				// everything except Firefox
				e.name === "QuotaExceededError" ||
				// Firefox
				e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
			// acknowledge QuotaExceededError only if there's something already stored
			storage &&
			storage.length !== 0
		);
	}
}

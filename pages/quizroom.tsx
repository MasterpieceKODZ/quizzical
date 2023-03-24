/* eslint-disable @next/next/no-img-element */
import QuestionInfo from "@/components/QuestionInfo";
import QuestionSpinner from "@/components/QuestionSpinner";
import { AppDB, appAuth } from "@/firebase.config";
import {
	optionBlurred,
	optionFocused,
	selectQuestionCategory,
	selectQuestionDifficulty,
} from "@/myFunctions/categoryOption";
import {
	displayLeaderboard,
	hideLeaderBoard,
	showLeaderBoard,
} from "@/myFunctions/leaderBoard";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import BallSpinnerModal from "@/components/BallSpinners";
import { closeImageCropperModal } from "@/myFunctions/openCloseImageCropperModal";
import { useRouter } from "next/router";
import {
	closeModal,
	finishImageEdit,
	updateUserProfilePic,
	viewUserProfile,
} from "@/myFunctions/editUserData";
import {
	cropImage,
	handelImageFileSelection,
	selectAvatar,
	uploadImage,
} from "@/myFunctions/imageUpload";
import {
	editUserName,
	showDisplayNameEditLayout,
} from "@/myFunctions/userDisplayName";
import {
	collection,
	doc,
	getDoc,
	getDocs,
	limit,
	orderBy,
	query,
} from "firebase/firestore";
import {
	closeInfoModal,
	openInfoModal,
} from "@/myFunctions/openCloseQuizroomInfo";
import {
	hideLoadingSpinner,
	hideQuizroomLoadingSpinner,
	showLoadingSpinner,
} from "@/myFunctions/showHideSpinner";
import { showHidePassword } from "@/myFunctions/passwordToggle";
import {
	deleteUserAccount,
	hideDeleteAcctModal,
	showDeleteAcctModal,
} from "@/myFunctions/deleteAccount";
import { selectAnswer } from "@/myFunctions/questionAnswer";
import { startQuiz, storageAvailable } from "@/myFunctions/initiateQuiz";
import { NextQuestion } from "../myFunctions/initiateQuiz";
import { updateDoc } from "firebase/firestore";

const Quizroom = () => {
	const router = useRouter();

	const [pageReady, setPageReady] = useState(false);
	const [questionLoading, setQuestionLoading] = useState(false);
	const [questionInfo, setQuestionInfo] = useState(
		"You have 20 seconds for each question, Click start to begin...",
	);
	const [quizInProgress, setQuizInProgress] = useState(false);
	const [questionsLoaded, setQuestionsLoaded] = useState(false);
	const [questCategories, setQuestionsCategories] = useState([""]);
	const [questionOptions, setQuestionOptions] = useState([""]);
	const [activeQuestion, setActiveQuestion] = useState({} as any);
	const [questionNumber, setQuestionNumber] = useState(0);
	const [category, setCategory] = useState("");
	const [difficulty, setDifficulty] = useState("");
	const [timeLeft, setTimeLeft] = useState(20);
	const [showUserProfile, setShowUserProfile] = useState(false);
	const [showNewPicSelect, setShowNewPicSelect] = useState(false);
	const [imgURL, setImgUrl] = useState("");
	const [username, setUsername] = useState("");
	const [userData, setUserData] = useState(null as any);
	const [leaderboardData, setLeaderboardData] = useState([{}]);
	const [timeInterval, setTimeInterval] = useState(0);
	const usersRef = collection(AppDB, "users");
	let imageCropper: any;
	let fileType: any;

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(appAuth, (user) => {
			if (user) {
				if (user.emailVerified) {
					if (user.displayName) {
						// clear sessionStorage

						if (storageAvailable()) {
							window.sessionStorage.clear();

							// retry unsaved changes
							const highscore = window.localStorage.getItem(
								`${appAuth.currentUser?.uid as string}Highscore`,
							);
							const gamerank = window.localStorage.getItem(
								`${appAuth.currentUser?.uid as string}Gamerank`,
							);

							if (highscore) {
								// update user high score
								updateDoc(
									doc(AppDB, "users", appAuth.currentUser?.uid as string),
									{
										highscore,
									},
								)
									.then((r) => {
										window.localStorage.removeItem(
											`${appAuth.currentUser?.uid as string}Highscore`,
										);
									})
									.catch((e) => {
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
											`${highscore}`,
										);
									});
							}

							if (gamerank) {
								// update user high score
								updateDoc(
									doc(AppDB, "users", appAuth.currentUser?.uid as string),
									{
										gamerank,
									},
								)
									.then((r) => {
										window.localStorage.removeItem(
											`${appAuth.currentUser?.uid as string}Gamerank`,
										);
									})
									.catch((e) => {
										openInfoModal(
											"",
											"we could not save your new gamerank to the server, check your network and reload the page to save game result, this data will be lost if you play another game without saving it.",
											"error",
										);
										setTimeout(() => {
											closeInfoModal();
										}, 5000);

										window.localStorage.setItem(
											`${appAuth.currentUser?.uid as string}Gamerank`,
											`${gamerank}`,
										);
									});
							}
						} else {
							openInfoModal(
								"",
								"This browser appears to not support data persistence to browser storage,if you have disabled it please, enable it to use this app",
								"error",
							);
						}

						setImgUrl(user?.photoURL as string);
						setUsername(user?.displayName as string);

						// fetch user data from firestore database
						const docRef = doc(AppDB, "users", user.uid);

						getDoc(docRef)
							.then((snapshot) => {
								setUserData(snapshot.data() as any);
								// fetch top 5 players by gamerank
								const q = query(
									usersRef,
									orderBy("gamerank", "desc"),
									limit(5),
								);
								getDocs(q)
									.then((usersSnapshot) => {
										let leaders: object[] = [];

										usersSnapshot.forEach((doc) => {
											leaders = [...leaders, doc.data()];
										});

										setLeaderboardData(leaders);

										// get questions category
										const xhr = new XMLHttpRequest();
										xhr.open(
											"GET",
											"https://the-trivia-api.com/api/categories",
											true,
										);
										xhr.send();

										xhr.onload = () => {
											if (xhr.status === 200) {
												const cateObj = JSON.parse(xhr.responseText);
												let categories: string[] = Object.keys(cateObj);
												setQuestionsCategories(categories);

												setPageReady(true);
											}
										};
									})
									.catch((e) => {
										openInfoModal(
											"",
											"An error occurred while trying to fetch leader board data, it could be your network, please reload the page to retry.",
											"error",
										);
										hideQuizroomLoadingSpinner();
									});
							})
							.catch((e) => {
								openInfoModal(
									"",
									"An error occurred while trying to fetch user data, it could be your network, please reload the page to retry.",
									"error",
								);
								hideQuizroomLoadingSpinner();
							});
					} else {
						router.push("/signup_2");
					}
				} else {
					router.push("/request_email_verification");
				}
			} else {
				router.push("/login");
			}
		});

		return () => {
			unsubscribe();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<div className="relative w-[100vw] h-[100vh]">
			{pageReady ? (
				<div className="relative w-full max-w-[100vw] h-[100vh] min-h-[100vh] max-h-[100vh] overflow-auto bg-blue-500">
					<div className="relative w-full max-w-[100vw] min-h-[100vh]">
						<div className="flex items-center justify-center py-3">
							<img
								src="/brand.png"
								alt="brand quizzical"
								className="img-login-brand w-[30%] max-w-[215px] min-w-[130px] h-auto object-cover"
							/>
						</div>
						{/* quiz question options */}

						<div
							id="quiz-option-host"
							className={`w-full max-w-[450px] max-h-[36px] mt-2 mx-auto px-1 ${
								questionsLoaded || questionLoading ? "invisible" : "flex"
							} items-center justify-around relative`}>
							{/* questions category */}
							<div
								tabIndex={0}
								className={`w-0 h-0 absolute  ${
									quizInProgress ? "invisible" : ""
								}`}
								onFocus={(e) => optionBlurred("category")}></div>
							<div
								tabIndex={0}
								aria-owns="category-menu"
								aria-expanded="false"
								aria-label="Select Question Category"
								id="category-option-host"
								className={`w-max h-max p-1 relative cursor-pointer option-host-cl ${
									quizInProgress ? "invisible" : ""
								}`}
								onMouseEnter={(e) => optionBlurred("difficulty")}
								onFocus={optionFocused}>
								<div
									tabIndex={-1}
									id="select-category"
									className="px-3 py-[2px] bg-primary text-secondary font-newRocker cursor-pointer">
									Category
								</div>
								<div
									id="category-menu"
									role="menu"
									aria-label="questions category list"
									tabIndex={-1}
									className="absolute top-[100%] left-0 w-max max-h-[300px] overflow-y-auto bg-yellow-100 rounded-lg border-2 border-slate-700 py-4 px-6 category-options-wrapper z-10">
									{questCategories.map((cate: string, index: number) => (
										<button
											key={index}
											aria-label="Agriculture"
											role="menuitem"
											tabIndex={0}
											className="w-max mt-2 category-option min-w-[160px] cursor-pointer block text-left font-semibold"
											onClick={(e) => selectQuestionCategory(e, setCategory)}>
											{cate}
											<i className="fas fa-check ml-2 option-check"></i>
										</button>
									))}
									<div
										tabIndex={0}
										onBlur={(e) => optionBlurred("category")}></div>
								</div>
							</div>
							{/* question difficulty */}
							<div
								tabIndex={0}
								className={`w-0 h-0 absolute ${
									quizInProgress ? "invisible" : ""
								}`}
								onFocus={(e) => optionBlurred("difficulty")}></div>
							<div
								tabIndex={0}
								aria-owns="difficulty-menu"
								aria-expanded="false"
								aria-label="Select Question Difficulty"
								id="difficulty-option-host"
								className={`w-max h-max p-1 relative cursor-pointer option-host-cl ${
									quizInProgress ? "invisible" : ""
								}`}
								onMouseEnter={(e) => optionBlurred("category")}
								onFocus={optionFocused}>
								<div
									tabIndex={-1}
									id="select-difficulty"
									className="px-3 py-[2px] bg-primary text-secondary font-newRocker cursor-pointer">
									Difficulty
								</div>
								<div
									id="difficulty-menu"
									role="menu"
									aria-label="questions difficulty list"
									tabIndex={-1}
									className="absolute top-[100%] right-0 w-max max-h-[300px] overflow-y-auto bg-yellow-100 rounded-lg border-2 border-slate-700 py-4 px-6 difficulty-options-wrapper z-10">
									<button
										aria-label="easy"
										role="menuitem"
										tabIndex={0}
										className="w-max mt-2 difficulty-option min-w-[110px] cursor-pointer block text-left font-semibold"
										onClick={(e) => selectQuestionDifficulty(e, setDifficulty)}>
										Easy <i className="fas fa-check ml-2 option-check"></i>
									</button>
									<button
										aria-label="medium"
										tabIndex={0}
										role="menuitem"
										className="w-max mt-2 difficulty-option min-w-[110px] cursor-pointer block text-left font-semibold"
										onClick={(e) => selectQuestionDifficulty(e, setDifficulty)}>
										Medium
										<i className="fas fa-check ml-2 option-check"></i>
									</button>
									<button
										aria-label="hard"
										tabIndex={0}
										role="menuitem"
										className="w-max mt-2 difficulty-option min-w-[110px] cursor-pointer block text-left font-semibold"
										onClick={(e) => selectQuestionDifficulty(e, setDifficulty)}>
										Hard
										<i className="fas fa-check ml-2 option-check"></i>
									</button>
									<div
										tabIndex={0}
										onBlur={(e) => optionBlurred("difficulty")}></div>
								</div>
							</div>
						</div>

						<div className="w-[90%] h-[290px] tallXS:h-[360px] tallS:h-[400px] tall:h-[450px] tallL:h-[500px] max-w-[700px] bg-[#010029] mt-3 mx-auto rounded-xl overflow-hidden grid grid-rows-[auto_1fr_auto] relative question-monitor">
							{!questionLoading && !questionInfo && questionsLoaded ? (
								<div
									tabIndex={-1}
									id="question-timer"
									className=" border-b-[1px] border-b-lime-600 text-lime-600 text-center relative text-[12px] mobileL:text-[14px] mobileXL:text-[16px] tabM:text-[18px] laptopS:text-[20px]">
									You Have{" "}
									<span
										role="timer"
										className="text-[17px] mobileL:text-[20px] mobileXL:text-[23px] tabM:text-[26px] laptopS:text-[29px]">
										{timeLeft}
									</span>{" "}
									Seconds Left
									<p
										id="question-num"
										className="border-b-lime-600 text-lime-600 text-[17px] mobileL:text-[20px] mobileXL:text-[23px] tabM:text-[26px] laptopS:text-[29px] w-max h-max absolute top-0 left-3">
										{questionNumber}.
									</p>
								</div>
							) : (
								""
							)}
							{!questionLoading && !questionInfo && questionsLoaded ? (
								<div
									id="question-text-host"
									className="overflow-y-auto !h-full">
									<p
										tabIndex={0}
										role="alert"
										id="question-text"
										className="font-specialElite mx-2 text-lime-600 text-[12px] mobileL:text-[14px] mobileXL:text-[16px] tabM:text-[18px] laptopS:text-[20px]">
										{activeQuestion.question}
									</p>
								</div>
							) : (
								""
							)}

							{!questionLoading && !questionInfo && questionsLoaded ? (
								<div
									id="answer-options"
									className="w-full max-h-[125px] tabS:max-h-[110px] laptopS:max-h-[120px] overflow-y-auto border-t-[1px] border-t-lime-600 text-lime-600 text-center p-[2px]">
									{questionOptions.map((option, index) => (
										<button
											key={index}
											className="w-[50%] max-w-[45%] inline-block border-[1px] text-[12px] mobileL:text-[14px] laptopS:text-[20px] border-lime-600 m-1 font-semibold"
											onClick={(e) => selectAnswer(e)}>
											{option}
										</button>
									))}
								</div>
							) : (
								""
							)}
							{questionLoading && !questionInfo && !questionsLoaded ? (
								<QuestionSpinner />
							) : (
								""
							)}
							{questionInfo && !questionLoading && !questionsLoaded ? (
								<QuestionInfo info={questionInfo} />
							) : (
								""
							)}
						</div>
						<div className="flex justify-center items-center">
							{quizInProgress || questionLoading ? (
								<button
									className={`min-w-[120px] min-h-[46px] p-0 mt-3 rounded-lg bg-[#4e4ec2] relative overflow-hidden  ${
										quizInProgress ? "" : "invisible"
									}`}
									onClick={(e) => {
										clearInterval(timeInterval);
										setTimeLeft(20);
										NextQuestion(
											setQuestionNumber,
											setActiveQuestion,
											userData,
											setQuestionInfo,
											setTimeLeft,
											setQuestionsLoaded,
											setQuestionLoading,
											setQuestionOptions,
											setQuizInProgress,
											setTimeInterval,
										);
									}}>
									<div
										id="next-btn-child"
										className="w-[95%] bg-primary py-[2px] m-0 rounded-lg sub-btn-in absolute top-[50%] translate-y-[-52%] left-[50%] translate-x-[-50%] text-center text-white text-[14px]  mobileL:text-[18px] mobileXL:text-[22px]">
										NEXT
									</div>
								</button>
							) : (
								<button
									className={`min-w-[120px] min-h-[46px] p-0 mt-3 rounded-lg bg-[#4e4ec2] relative overflow-hidden  ${
										quizInProgress ? "invisible" : ""
									}`}
									onClick={async (e) => {
										startQuiz(
											setQuestionLoading,
											setQuestionInfo,
											setQuestionsLoaded,
											setQuizInProgress,
											category,
											difficulty,
											setQuestionNumber,
											setActiveQuestion,
											setQuestionOptions,
											setTimeLeft,
											setTimeInterval,
											userData,
										);
									}}>
									<div className="w-[95%] bg-primary py-[2px] m-0 rounded-lg sub-btn-in absolute top-[50%] translate-y-[-52%] left-[50%] translate-x-[-50%] text-center text-white text-[14px]  mobileL:text-[18px] mobileXL:text-[22px]">
										START
									</div>
								</button>
							)}
						</div>

						<div
							id="leaderboard-host"
							tabIndex={-1}
							className="w-max h-max absolute bottom-1 right-1 leaderboard-host-cl">
							<div
								tabIndex={0}
								className="w-0 h-0"
								onFocus={(e) => hideLeaderBoard()}></div>
							<img
								src="/leaderboard-icon.png"
								id="leaderboard-icon"
								aria-controls="leaderboard-menu"
								aria-label="show leader board"
								alt="leader board icon"
								tabIndex={0}
								className="w-[50px] h-[50px] object-cover rounded"
								onClick={displayLeaderboard}
								onFocus={showLeaderBoard}
							/>
							{/* leaderboard menu layout */}
							<div
								id="leaderboard-menu"
								role="menu"
								aria-label="questions category list"
								tabIndex={-1}
								className="absolute bottom-0 right-[100%] w-max max-h-[300px] overflow-y-auto bg-yellow-100 rounded-lg border-2 border-slate-700 py-2 px-1  z-20 leaderboard-wrapper">
								{leaderboardData.map((data: any, index: number) => (
									<div
										key={index}
										aria-label="name"
										role="menuitem"
										tabIndex={0}
										className="w-[20px] mt-2 min-w-[160px] cursor-pointer flex justify-start items-center font-semibold leaderboard-menuitem p-1 m-2">
										<img
											src={`${data.imgURL}`}
											alt="user image"
											className="w-[40px] h-[40px] inline mr-3 border-2 border-secondary"
										/>
										<div className="inline">
											<p className=" text-left text-[13px] text-primary font-newRocker">
												{data.username}
											</p>
											<p className=" text-left text-[11px] font-julee text-accent">
												{data.gamerank}
											</p>
										</div>
									</div>
								))}
								<div
									className="w-0 h-0"
									tabIndex={0}
									onBlur={(e) => hideLeaderBoard()}></div>
							</div>
						</div>
						{questionsLoaded ? (
							""
						) : (
							<button
								id="btn-view-user-profile"
								aria-label="view user profile"
								aria-controls="user-profile-modal"
								className="w-max h-max absolute bottom-1 left-1 p-0"
								onClick={(e) => viewUserProfile(setShowUserProfile)}>
								<img
									src={imgURL ? imgURL : "/placeholder.jpg"}
									alt="user profile"
									className="w-[60px] h-[60px] rounded-[50%] object-cover border-2 border-secondary"
								/>
							</button>
						)}
					</div>
					{/* user profile modal */}
					{showUserProfile ? (
						<div
							role="dialog"
							aria-label="user profile dialog open"
							id="user-profile-modal"
							tabIndex={0}
							className="w-[100vw] h-[100vh] absolute top-0 left-0 z-10 flex justify-center items-center bg-[#787a7ae1]">
							<div className="w-[90%] h-[90%] bg-white rounded-md max-w-[400px] relative">
								<div className="w-[100px] h-[100px] rounded-[50%] mx-auto mt-3 overflow-hidden relative">
									<img
										id="user-profile-pic"
										src={imgURL ? imgURL : "/placeholder.jpg"}
										alt="user profile picture"
										className="w-[100px] h-[100px] rounded-[50%] object-cover"
									/>
									<button
										id="pic-edit-btn"
										tabIndex={0}
										className="w-full h-[30%] absolute bottom-0 right-0 left-0  bg-[#697c75b4] text-white"
										onClick={async (e) => {
											await updateUserProfilePic(setShowNewPicSelect);
											document
												.getElementById("select-new-avatar-title")
												?.focus();
										}}>
										EDIT
									</button>
								</div>
								<p
									id="profile-username"
									className="w-max text-center mx-auto text[16px] font-newRocker mt-2 relative">
									{username ? username : ""}
									<button
										title="edit username"
										aria-label="edit username"
										id="edit-profile-img"
										onClick={showDisplayNameEditLayout}
										tabIndex={0}
										className="fas fa-pencil w-max h-max p-0 absolute top-[2px] right-[-30px]"></button>
								</p>
								<div
									id="new-dn-host"
									className="hidden justify-between items-center mt-3">
									<input
										type="text"
										name="newdisplayname"
										id="inp-new-display-name"
										placeholder="new display name"
										className="w-[70%] rounded p-[2px] ml-4"
										required
									/>
									<button
										title="update username"
										aria-label="submit username change"
										id="submit-new-dn"
										onClick={editUserName}
										className="w-max h-max p-0 fas fa-check-double mr-5"></button>
								</div>
								<div className="mt-3 flex items-center justify-between">
									<p className="mx-4 text[16px] text-left font-wallpoet mt-2 inline">
										High Score
									</p>
									<p
										id="profile-highscore"
										className="text-right mx-4 text[16px] font-wallpoet mt-2 inline">
										{userData ? userData.highscore : ""}
									</p>
								</div>
								<div className="mt-3 flex items-center justify-between">
									<p className="text-left mx-4 text[16px] font-wallpoet mt-2 inline">
										Game Rank
									</p>
									<p
										id="profile-rank"
										className="text-right mx-4 text[16px] font-wallpoet mt-2 inline">
										{userData ? userData.gamerank : ""}
									</p>
								</div>
								<button
									id="btn-signout"
									className="font-bold block w-max py-1 px-3 text-blue-500 ml-1 mt-5"
									onClick={(e) => {
										openInfoModal(
											"",
											"To change your password, first sign out, then use the forgot password button on the login page",
											"info",
										);
										setTimeout(() => {
											closeInfoModal();
										}, 6000);
									}}>
									Change Password
								</button>
								<button
									id="btn-signout"
									className="font-bold block w-max py-1 px-3 text-blue-500 ml-1 mt-5"
									onClick={(e) => {
										showLoadingSpinner();
										signOut(appAuth).then(() => hideLoadingSpinner());
									}}>
									Sign Out
								</button>
								<button
									id="btn-delete-account"
									className="font-bold w-max py-1 px-3 text-red-500 absolute bottom-2 left-[50%] translate-x-[-50%]"
									onClick={(e) => {
										showDeleteAcctModal();
										document.getElementById("del-acct-pw-inp")?.focus();
									}}>
									Delete My Account
								</button>
								<button
									title="close"
									aria-label="close modal"
									id="close-profile-modal"
									onClick={async (e) => {
										await closeModal(setShowUserProfile);
										document.getElementById("btn-view-user-profile")?.focus();
									}}
									className="fas fa-xmark absolute top-[10px] right-[10px] text-red-600 text-[25px]"></button>
							</div>
						</div>
					) : (
						""
					)}

					{/* new profile picture selection modal */}
					{showNewPicSelect ? (
						<div
							role="dialog"
							id="new-dp-modal"
							className="w-[100vw] h-[100vh] absolute top-0 left-0 z-20 flex justify-center items-center bg-[#787a7acb] new-dp-modal-cl">
							<div className="w-[90%] h-[90%] bg-white rounded-md max-w-[400px] relative overflow-hidden grid grid-rows-[auto_1fr_auto]">
								<div className="w-full mx-auto py-3 bg-white">
									<p
										id="select-new-avatar-title"
										aria-label="select new avatar"
										tabIndex={0}
										className="text-center text-primary font-bold text-[18px] mobileL:text-[23px] mobileXL:text-[29px] font-julee">
										Select New Avatar
									</p>
									<button
										title="close"
										aria-label="close modal"
										id="close-profile-modal"
										onClick={async (e) => {
											await closeModal(setShowNewPicSelect);
											document.getElementById("pic-edit-btn")?.focus();
										}}
										className="fas fa-xmark absolute top-[20px] right-[10px] text-red-600 text-[25px]"></button>
								</div>

								<div className="w-[90%] h-full max-w-[400px] mx-auto overflow-y-auto relative">
									<div className="p-2 flex flex-wrap items-center justify-evenly relative">
										<img
											title="avatar 1"
											role="button"
											src="/avatar-1.png"
											tabIndex={0}
											alt="avatar 1"
											className="w-[70px] h-auto object-cover inline-block m-2 avatar-img"
											onClick={selectAvatar}
										/>
										<img
											title="avatar 2"
											role="button"
											src="/avatar-2.png"
											tabIndex={0}
											alt="avatar 2"
											className="w-[70px] h-auto object-cover inline-block m-2 avatar-img"
											onClick={selectAvatar}
										/>
										<img
											title="avatar 3"
											role="button"
											src="/avatar-3.png"
											tabIndex={0}
											alt="avatar 3"
											className="w-[70px] h-auto object-cover inline-block m-2 avatar-img"
											onClick={selectAvatar}
										/>
										<img
											title="avatar 4"
											role="button"
											src="/avatar-4.png"
											tabIndex={0}
											alt="avatar 4"
											className="w-[70px] h-auto object-cover inline-block m-2 avatar-img"
											onClick={selectAvatar}
										/>
										<img
											title="avatar 5"
											role="button"
											src="/avatar-5.png"
											tabIndex={0}
											alt="avatar 5"
											className="w-[70px] h-auto object-cover inline-block m-2 avatar-img"
											onClick={selectAvatar}
										/>
										<img
											title="avatar 6"
											role="button"
											src="/avatar-6.png"
											tabIndex={0}
											alt="avatar 6"
											className="w-[70px] h-auto object-cover inline-block m-2 avatar-img"
											onClick={selectAvatar}
										/>
										<img
											title="avatar 7"
											role="button"
											src="/avatar-7.png"
											tabIndex={0}
											alt="avatar 7"
											className="w-[70px] h-auto object-cover inline-block m-2 avatar-img"
											onClick={selectAvatar}
										/>
										<img
											title="avatar 8"
											role="button"
											tabIndex={0}
											src="/avatar-8.png"
											alt="avatar 8"
											className="w-[70px] h-auto object-cover inline-block m-2 avatar-img"
											onClick={selectAvatar}
										/>
										<img
											title="avatar 9"
											role="button"
											src="/avatar-9.png"
											tabIndex={0}
											alt="avatar 9"
											className="w-[70px] h-auto object-cover inline-block m-2 avatar-img"
											onClick={selectAvatar}
										/>
										<img
											title="avatar 10"
											role="button"
											src="/avatar-10.png"
											tabIndex={0}
											alt="avatar 10"
											className="w-[70px] h-auto object-cover inline-block m-2 avatar-img"
											onClick={selectAvatar}
										/>
										<img
											title="avatar 11"
											role="button"
											src="/avatar-11.png"
											tabIndex={0}
											alt="avatar 11"
											className="w-[70px] max-w-[70px] h-auto object-cover inline-block m-2 avatar-img"
											onClick={selectAvatar}
										/>
										<div
											className="w-[70px] max-w-[70px] h-[70px] max-h-[70px]  inline-block m-2 upload-photo relative overflow-hidden"
											id="custom-img-host">
											<img
												id="img-upload-preview"
												src="/custom_img_PH.png"
												alt="custom avatar"
												className="w-full h-full object-cover"
											/>
											<div
												tabIndex={0}
												role="button"
												aria-label="select custom avatar"
												className="w-full h-full absolute top-0 left-0 overflow-hidden bg-[#9da9b363]"
												onClickCapture={(e) => {
													const imgPrev: any =
														document.getElementById("img-upload-preview");
													const activeAvatar =
														document.querySelector(".active");

													if (activeAvatar) {
														activeAvatar.classList.remove("active");
													}

													// if custom image has not been selected, select new custom  image, else set selected image preview as active avatar

													if (imgPrev?.src.endsWith("custom_img_PH.png")) {
														uploadImage();
													} else {
														document
															.getElementById("custom-img-host")
															?.classList.add("active");
													}
												}}>
												<button
													title="upload custom image"
													aria-label="upload custom avatar"
													className=" w-full h-max text-center absolute bottom-0 text-white"
													onClick={(e) => {
														uploadImage();
													}}>
													<i className="fas fa-file-arrow-up"></i> Edit
												</button>
											</div>
										</div>

										<input
											tabIndex={-1}
											type="file"
											name="uploadimage"
											accept=".jpg, .jpeg, .png, .webp"
											id="profile-pic-file"
											className="w-0 h-0 overflow-hidden"
											onChange={async (e: any) => {
												// render the selected image on the image cropper modal
												await handelImageFileSelection(e).then((res) => {
													imageCropper = res;
													fileType = e.target.files[0].type;
												});
											}}
										/>
									</div>
								</div>
								<button
									type="submit"
									className="min-w-[120px] min-h-[46px] p-0 mt-3 mb-2 rounded-lg bg-[#4e4ec2] relative overflow-hidden block mx-auto"
									onClick={(e) => finishImageEdit(imageCropper)}>
									<div
										className={`w-[95%] bg-primary py-[2px] m-0 rounded-lg sub-btn-in absolute top-[50%] translate-y-[-52%] left-[50%] translate-x-[-50%] text-center text-white text-[14px]  mobileL:text-[18px] mobileXL:text-[22px] ${
											quizInProgress ? "invisible" : ""
										}`}>
										Done
									</div>
								</button>
							</div>
						</div>
					) : (
						""
					)}

					{/* ------- new custom image cropper modal -------- */}
					<div
						id="img-cropper-modal"
						className="absolute w-[100vw] h-[100vh] top-0 left-0 bottom-0 right-0 z-30 bg-[#9da9b3f3] hidden justify-center items-center">
						<div
							id="img-cropper-cont"
							className="w-[95vw] max-w-[450px] p-2 rounded-md border-2 border-accent">
							<div
								id="cropper-img-holder"
								className="w-[75vw] h-[75vw] max-w-[350px] max-h-[350px] overflow-y-auto overflow-x-hidden border-2 border-primary mt-2 mx-auto mb-4 cropper-image-cont">
								<img
									id="cropper-img"
									className="w-full h-auto"
									src="/placeholder.jpg"
									alt="image cropper placeholder"
								/>
							</div>
							<button
								type="button"
								className=" min-w-[180px] min-h-[46px] p-0 mt-2 rounded-lg bg-[#4e4ec2] block mx-auto mb-6 relative overflow-hidden">
								<div
									className="w-[95%] bg-primary py-[2px] m-0 rounded-lg sub-btn-in absolute top-[50%] translate-y-[-52%] left-[50%] translate-x-[-50%] text-center text-white text-[16px]  mobileL:text-[18px] mobileXL:text-[22px]"
									onClick={(e) => {
										cropImage(imageCropper as Cropper, fileType as string);
									}}>
									CROP IMAGE
								</div>
							</button>
							<button
								type="button"
								className=" min-w-[180px] min-h-[46px] p-0 mt-2 rounded-lg bg-red-500 block mx-auto mb-6 relative overflow-hidden">
								<div
									className="w-[95%] bg-red-800 py-[2px] m-0 rounded-lg sub-btn-in absolute top-[50%] translate-y-[-52%] left-[50%] translate-x-[-50%] text-center text-white text-[16px]  mobileL:text-[18px] mobileXL:text-[22px]"
									onClick={(e) => {
										closeImageCropperModal(imageCropper as Cropper);
									}}>
									CANCEL
								</div>
							</button>
						</div>
					</div>

					{/* confirm delete modal */}
					<div
						role="dialog"
						id="del-acct-modal"
						className="w-[100vw] h-[100vh] absolute top-0 left-0 z-20 hidden justify-center items-center bg-[#787a7acb] del-acct-modal-cl">
						<div
							id="del-acct-modal-wrapper"
							className="w-[90%] h-[90%] bg-white rounded-md max-w-[400px] relative overflow-hidden flex flex-col items-center justify-center">
							<p
								id="del-acct-alert"
								role="alert"
								className="text-center mx-2 text-slate-800 font-julee"></p>
							<div className="password-host block w-[80%] p-[2px] mx-auto mt-8 rounded relative bg-white overflow-hidden">
								<input
									type="password"
									name="loginpassword"
									id="del-acct-pw-inp"
									className="inline w-[88%] outline-white bg-transparent"
									required
								/>
								{/* secondary password toggle */}
								<button
									type="button"
									aria-label="password toggle"
									className="fas fa-eye ml-1 w-max h-max bg-transparent border-0"
									onClick={(e) => showHidePassword(e, "delete")}></button>
							</div>
							<p
								role="alert"
								id="delete-password-status"
								className="w-0 h-0 overflow-hidden"></p>
							<p />

							<div className="flex justify-between items-center mt-8 w-full">
								<button
									type="button"
									className="min-w-[94px] min-h-[36px] p-0 rounded-lg bg-red-500 block mx-auto mb-6 relative overflow-hidden"
									onClick={deleteUserAccount}>
									<div className="w-[92%] p-2 bg-red-800 py-[2px] m-0 rounded-lg sub-btn-in absolute top-[50%] translate-y-[-52%] left-[50%] translate-x-[-50%] text-center text-white">
										PROCEED
									</div>
								</button>
								<button
									type="button"
									className="min-w-[94px] min-h-[36px] p-0 rounded-lg bg-lime-400 block mx-auto mb-6 relative overflow-hidden"
									onClick={(e) => {
										hideDeleteAcctModal();
										document.getElementById("btn-delete-account")?.focus();
									}}>
									<div className="w-[92%] bg-lime-700 py-[2px] m-0 rounded-lg sub-btn-in absolute top-[50%] translate-y-[-52%] left-[50%] translate-x-[-50%] text-center text-white">
										CANCEL
									</div>
								</button>
							</div>
						</div>
					</div>
					<BallSpinnerModal />
				</div>
			) : (
				<div
					id="quizroom-loading-spinner"
					className="absolute top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center w-full h-full spinner-modal">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="-50 -50 100 100"
						width="100"
						height="100">
						<g transform="rotate(0)">
							<circle
								cx="0"
								cy="-40"
								r="10"
								fill="red"
							/>
						</g>
						<g transform="rotate(120)">
							<circle
								cx="0"
								cy="-40"
								r="10"
								fill="yellow"
							/>
						</g>
						<g transform="rotate(240)">
							<circle
								cx="0"
								cy="-40"
								r="10"
								fill="green"
							/>
						</g>
						<animateTransform
							attributeName="transform"
							type="rotate"
							from="0 0 0"
							to="360 0 0"
							dur="2s"
							repeatCount="indefinite"
						/>
					</svg>
				</div>
			)}
			{/* quizroom Info modal */}
			<div
				role="dialog"
				id="info-modal"
				className="w-[100vw] h-[100vh] absolute top-0 left-0 z-40 hidden justify-center items-center bg-[#787a7acb] info-modal-cl">
				<div
					id="info-modal-wrapper"
					className="w-[90%] h-[90%] bg-white rounded-md max-w-[400px] relative overflow-hidden flex flex-col items-center justify-center">
					<p
						role="alert"
						id="quizroom-info-modal-title"
						className="text-center mx-2 font-julee mb-8 text-[25px] font-bold">
						Congratulations
					</p>
					<p
						role="alert"
						id="quizroom-info-modal-body"
						className="text-center mx-2 font-julee">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia
						eaque ex dolor autem facilis consequatur voluptate ut, est iste
						quaerat aspernatur repudiandae quos at. Nulla omnis fuga deserunt
						illum ratione?
					</p>
					<button
						id="btn-restart"
						className="min-w-[120px] min-h-[46px] p-0 mt-3 rounded-lg bg-[#58c24e] absolute bottom-2 left-[50%] translate-x-[-50%] overflow-hidden hidden"
						onClick={(e) => {
							window.sessionStorage.clear();
							window.location.reload();
						}}>
						<div className="w-[95%] bg-[#208517] py-[2px] m-0 rounded-lg sub-btn-in absolute top-[50%] translate-y-[-52%] left-[50%] translate-x-[-50%] text-center text-white text-[14px]  mobileL:text-[18px] mobileXL:text-[22px]">
							PLAY AGAIN
						</div>
					</button>
				</div>
			</div>
		</div>
	);
};

export default Quizroom;

/* eslint-disable @next/next/no-img-element */
import QuestionInfo from "@/components/QuestionInfo";
import QuestionSpinner from "@/components/QuestionSpinner";
import { appAuth } from "@/firebase.config";
import {
	optionBlurred,
	optionFocused,
	selectQuestionCategory,
	selectQuestionDifficulty,
} from "@/myFunctions/categoryOption";
import { hideLeaderBoard, showLeaderBoard } from "@/myFunctions/leaderBoard";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

const Quizroom = () => {
	const [questionLoading, setQuestionLoading] = useState(false);
	const [questionInfo, setQuestionInfo] = useState(false);
	const [quizInProgress, setQuizInProgress] = useState(false);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(appAuth, (user) => {});

		return () => {
			unsubscribe();
		};
	}, []);
	return (
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
					className="w-full max-w-[450px] mt-2 mx-auto px-1 flex items-center justify-around relative">
					{/* questions category */}
					<div
						tabIndex={0}
						className={`w-0 h-0 absolute  ${quizInProgress ? "invisible" : ""}`}
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
							<button
								aria-label="Agriculture"
								role="menuitem"
								tabIndex={0}
								className="w-max mt-2 category-option min-w-[160px] cursor-pointer block text-left font-semibold"
								onClick={selectQuestionCategory}>
								Agriculture <i className="fas fa-check ml-2 option-check"></i>
							</button>
							<button
								aria-label="General Knowledge"
								tabIndex={0}
								role="menuitem"
								className="w-max mt-2 category-option min-w-[160px] cursor-pointer block text-left font-semibold"
								onClick={selectQuestionCategory}>
								General Knowledge
								<i className="fas fa-check ml-2 option-check"></i>
							</button>
							<div
								tabIndex={0}
								onBlur={(e) => optionBlurred("category")}></div>
						</div>
					</div>
					{/* question difficulty */}
					<div
						tabIndex={0}
						className={`w-0 h-0 absolute ${quizInProgress ? "invisible" : ""}`}
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
								onClick={selectQuestionDifficulty}>
								Easy <i className="fas fa-check ml-2 option-check"></i>
							</button>
							<button
								aria-label="medium"
								tabIndex={0}
								role="menuitem"
								className="w-max mt-2 difficulty-option min-w-[110px] cursor-pointer block text-left font-semibold"
								onClick={selectQuestionDifficulty}>
								Medium
								<i className="fas fa-check ml-2 option-check"></i>
							</button>
							<button
								aria-label="hard"
								tabIndex={0}
								role="menuitem"
								className="w-max mt-2 difficulty-option min-w-[110px] cursor-pointer block text-left font-semibold"
								onClick={selectQuestionDifficulty}>
								Hard
								<i className="fas fa-check ml-2 option-check"></i>
							</button>
							<div
								tabIndex={0}
								onBlur={(e) => optionBlurred("difficulty")}></div>
						</div>
					</div>
				</div>
				<div className="w-[280px] h-[290px] tallXS:h-[360px] tallS:h-[400px] tall:h-[450px] tallL:h-[500px] mobileL:w-[350px] tabM:w-[450px] tabL:w-[500px] laptopS:w-[550px] laptopM:w-[600px] max-w-[600px] bg-[#010029] mt-3 mx-auto rounded-xl overflow-hidden question-monitor grid grid-rows-[auto_1fr_auto] relative">
					{!questionLoading && !questionInfo ? (
						<div
							tabIndex={-1}
							id="question-timer"
							className=" border-b-[1px] border-b-lime-600 text-lime-600 text-center relative">
							You Have{" "}
							<span
								role="timer"
								className="text-[25px]">
								0
							</span>{" "}
							Seconds Left
							<p
								id="question-num"
								className="border-b-lime-600 text-lime-600 text-[25px] w-max h-max absolute top-0 left-3">
								1.
							</p>
						</div>
					) : (
						""
					)}
					{!questionLoading && !questionInfo ? (
						<div
							id="question-text-host"
							className="overflow-y-auto">
							<p
								tabIndex={0}
								role="alert"
								id="question-text"
								className="font-specialElite mx-2 text-lime-600 text-[16px]">
								How many seconds are there in 15 minutes? Lorem ipsum dolor sit
								amet consectetur adipisicing elit. Ab dolor ipsum eveniet, at
								repellat delectus nam nisi porro doloremque aliquid numquam
								tempore, tempora minus praesentium consequuntur officia nostrum
								quam illo. Animi quasi neque at natus enim facere quae
								architecto repudiandae!
							</p>
						</div>
					) : (
						""
					)}

					{!questionLoading && !questionInfo ? (
						<div
							id="answer-options"
							className="w-full border-t-[1px] border-t-lime-600 text-lime-600 text-center p-[2px]">
							<button className="w-[50%] max-w-[45%] inline-block border-[1px] border-lime-600 m-1 bg-correct font-semibold">
								Twenty Five
							</button>
							<button className="w-[50%] max-w-[45%] inline-block  border-[1px] border-lime-600 m-1 bg-wrong font-semibold">
								Eleven
							</button>
							<button className="w-[50%] max-w-[45%] inline-block  border-[1px] border-lime-600 m-1 font-semibold">
								Manchecter United
							</button>
							<button className="w-[50%] max-w-[45%] inline-block  border-[1px] border-lime-600 m-1 font-semibold">
								Ten
							</button>
						</div>
					) : (
						""
					)}
					{questionLoading && !questionInfo ? <QuestionSpinner /> : ""}
					{questionInfo && !questionLoading ? <QuestionInfo /> : ""}
				</div>
				<div className="flex justify-center items-center">
					{quizInProgress ? (
						""
					) : (
						<button
							type="submit"
							className="min-w-[120px] min-h-[46px] p-0 mt-3 rounded-lg bg-[#4e4ec2] relative overflow-hidden">
							<div
								className={`w-[95%] bg-primary py-[2px] m-0 rounded-lg sub-btn-in absolute top-[50%] translate-y-[-52%] left-[50%] translate-x-[-50%] text-center text-white text-[14px]  mobileL:text-[18px] mobileXL:text-[22px] ${
									quizInProgress ? "invisible" : ""
								}`}>
								START
							</div>
						</button>
					)}
					{quizInProgress ? (
						<button
							type="submit"
							className="min-w-[120px] min-h-[46px] p-0 mt-3 rounded-lg bg-[#4e4ec2] relative overflow-hidden">
							<div
								className={`w-[95%] bg-primary py-[2px] m-0 rounded-lg sub-btn-in absolute top-[50%] translate-y-[-52%] left-[50%] translate-x-[-50%] text-center text-white text-[14px]  mobileL:text-[18px] mobileXL:text-[22px] ${
									quizInProgress ? "invisible" : ""
								}`}>
								NEXT
							</div>
						</button>
					) : (
						""
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
						onFocus={showLeaderBoard}
					/>
					<div
						id="leaderboard-menu"
						role="menu"
						aria-label="questions category list"
						tabIndex={-1}
						className="absolute bottom-0 right-[100%] w-max max-h-[300px] overflow-y-auto bg-yellow-100 rounded-lg border-2 border-slate-700 py-2 px-1  z-20 leaderboard-wrapper">
						<div
							aria-label="name"
							role="menuitem"
							tabIndex={0}
							className="w-max mt-2 min-w-[160px] cursor-pointer flex justify-center items-center font-semibold leaderboard-menuitem p-1 m-2">
							<img
								src="/avatar-1.png"
								alt="user image"
								className="w-[40px] h-[40px] inline mr-3 border-2 border-secondary"
							/>
							<div className="inline">
								<p className=" text-right text-[13px] text-primary font-newRocker">
									MANofVALOUR
								</p>
								<p className=" text-right text-[11px] font-julee text-accent">
									200
								</p>
							</div>
						</div>
						<div
							aria-label="name"
							role="menuitem"
							tabIndex={0}
							className="w-max mt-2 min-w-[160px] cursor-pointer flex justify-center items-center font-semibold leaderboard-menuitem p-1 m-2">
							<img
								src="/avatar-1.png"
								alt="user image"
								className="w-[40px] h-[40px] inline mr-3 border-2 border-secondary"
							/>
							<div className="inline">
								<p className=" text-right text-[13px] text-primary font-newRocker">
									MANofVALOUR
								</p>
								<p className=" text-right text-[11px] font-julee text-accent">
									200
								</p>
							</div>
						</div>
						<div
							className="w-0 h-0"
							tabIndex={0}
							onBlur={(e) => hideLeaderBoard()}></div>
					</div>
				</div>
				<img
					src="/placeholder.jpg"
					alt="user profile"
					aria-controls="user-profile-modal"
					role="button"
					tabIndex={0}
					aria-label="view your profile"
					className="w-[60px] h-[60px] rounded-[50%] object-cover absolute bottom-1 left-1"
				/>
			</div>
			{/* user profile modal */}
			<div
				role="dialog"
				id="user-profile-modal"
				tabIndex={0}
				className="w-[100vw] h-[100vh] absolute top-0 left-0 z-30 flex justify-center items-center bg-[#787a7ae1]">
				<div className="w-[90%] h-[90%] bg-white rounded-md max-w-[400px] relative">
					<div className="w-[100px] h-[100px] rounded-[50%] mx-auto mt-3 overflow-hidden relative">
						<img
							id="user-profile-pic"
							src="avatar-2.png"
							alt="user profile picture"
							className="w-[100px] h-[100px] rounded-[50%] object-cover"
						/>
						<button
							id="pic-edit-btn"
							tabIndex={0}
							className="w-full h-[30%] absolute bottom-0 right-0 left-0  bg-[#697c75b4] text-white">
							EDIT
						</button>
					</div>
					<p
						id="profile-username"
						className="w-max text-center mx-auto text[16px] font-newRocker mt-2 relative">
						MANofVALOUR
						<button
							title="edit username"
							aria-label="edit username"
							id="edit-profile-img"
							tabIndex={0}
							className="fas fa-pencil w-max h-max p-0 absolute top-[2px] right-[-30px]"></button>
					</p>
					<div
						id="new-dn-host"
						className="flex justify-between items-center mt-3">
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
							className="w-max h-max p-0 fas fa-check-double mr-5"></button>
					</div>
					<div className="mt-3 flex items-center justify-between">
						<p className="mx-4 text[16px] text-left font-wallpoet mt-2 inline">
							High Score
						</p>
						<p
							id="profile-highscore"
							className="text-right mx-4 text[16px] font-wallpoet mt-2 inline">
							200
						</p>
					</div>
					<div className="mt-3 flex items-center justify-between">
						<p className="text-left mx-4 text[16px] font-wallpoet mt-2 inline">
							Game Rank
						</p>
						<p
							id="profile-rank"
							className="text-right mx-4 text[16px] font-wallpoet mt-2 inline">
							140
						</p>
					</div>
					<button
						id="btn-signout"
						className="font-bold w-max py-1 px-3 text-blue-500 ml-1 mt-5">
						Sign Out
					</button>
					<button
						id="btn-delete-account"
						className="font-bold w-max py-1 px-3 text-red-500 absolute bottom-2 left-[50%] translate-x-[-50%]">
						Delete My Account
					</button>
					<button
						title="close"
						aria-label="close modal"
						id="close-profile-modal"
						className="fas fa-xmark absolute top-[10px] right-[10px] text-red-600 text-[25px]"></button>
				</div>
			</div>
		</div>
	);
};

export default Quizroom;

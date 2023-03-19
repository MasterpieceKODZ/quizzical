const QuestionInfo = () => {
	return (
		<div className="absolute top-0 left-0 w-full h-full flex justify-center items-center flex-col">
			<p
				id="question-info-text"
				className="text-center px-2 text-lime-600">
				Unable to fetch questions, please check your network and try again
			</p>
		</div>
	);
};

export default QuestionInfo;

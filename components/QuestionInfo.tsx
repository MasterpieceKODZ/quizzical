const QuestionInfo = ({ info }: any) => {
	return (
		<div className="absolute top-0 left-0 w-full h-full flex justify-center items-center flex-col">
			<p
				role="alert"
				aria-atomic="true"
				id="question-info-text"
				className="text-center px-2 text-lime-600">
				{info}
			</p>
		</div>
	);
};

export default QuestionInfo;

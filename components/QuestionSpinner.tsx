const QuestionSpinner = () => {
	return (
		<div
			id="question-spinner"
			className="absolute top-0 left-0 w-full h-full flex justify-center items-center flex-col">
			<svg
				width="50px"
				height="50px"
				viewBox="0 0 66 66"
				xmlns="http://www.w3.org/2000/svg">
				<circle
					cx="33"
					cy="33"
					r="25"
					fill="none"
					strokeWidth="6"
					stroke="#f1c40f"
					strokeDasharray="39.27 56.43">
					<animateTransform
						attributeName="transform"
						attributeType="XML"
						type="rotate"
						from="0 33 33"
						to="360 33 33"
						dur="2s"
						repeatCount="indefinite"
					/>
				</circle>
				<circle
					cx="33"
					cy="33"
					r="20"
					fill="none"
					strokeWidth="6"
					stroke="#e74c3c"
					strokeDasharray="31.42 64.56">
					<animateTransform
						attributeName="transform"
						attributeType="XML"
						type="rotate"
						from="0 33 33"
						to="-360 33 33"
						dur="2s"
						repeatCount="indefinite"
					/>
				</circle>
				<circle
					cx="33"
					cy="33"
					r="15"
					fill="none"
					strokeWidth="6"
					stroke="green"
					strokeDasharray="23.56 72.43">
					<animateTransform
						attributeName="transform"
						attributeType="XML"
						type="rotate"
						from="0 33 33"
						to="360 33 33"
						dur="2s"
						repeatCount="indefinite"
					/>
				</circle>
			</svg>
			<p className="text-center text-lime-600">
				loading questions please wait...
			</p>
		</div>
	);
};

export default QuestionSpinner;

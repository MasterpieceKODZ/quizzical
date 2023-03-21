const BallSpinnerModal = () => {
	return (
		<div
			id="login-spinner"
			className="absolute top-0 left-0 right-0 bottom-0 z-[100] justify-center items-center w-full h-full spinner-modal hidden">
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
	);
};

export default BallSpinnerModal;

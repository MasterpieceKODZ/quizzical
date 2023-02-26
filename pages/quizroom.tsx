import { appAuth } from "@/firebase.config";
import { useEffect } from "react";

const Quizroom = () => {
	useEffect(() => {
		setTimeout(() => {
			console.log(appAuth.currentUser?.emailVerified);
		}, 1000);
	}, []);

	return <div>Quizroom</div>;
};

export default Quizroom;

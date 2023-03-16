import { appAuth } from "@/firebase.config";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";

const Quizroom = () => {
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(appAuth, (user) => {});

		return () => {
			unsubscribe();
		};
	}, []);
	return <div>Quizroom</div>;
};

export default Quizroom;

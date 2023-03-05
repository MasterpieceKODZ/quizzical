import { appAuth } from "@/firebase.config";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default async function signUpNewUser(email: string, password: string) {
	createUserWithEmailAndPassword(appAuth, email, password)
		.then((credential) => {
			console.log(credential.user);
		})
		.catch((err) => {
			console.error(err);
		});
}

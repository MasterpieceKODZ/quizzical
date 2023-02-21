import { generalInitialState } from "./initialStates";
export function generalReducer(
	state: any = generalInitialState,
	{ type, payload }: any,
) {
	switch (type) {
		case "UPDATE_DEVELOPER_NAME":
			return { ...state, devName: payload };
		case "UPDATE_WELCOME_TEXT":
			return { ...state, welcomeText: payload };
		case "UPDATE_CHALLENGE_TEXT":
			return { ...state, challengeText: payload };
		default:
			return state;
	}
}

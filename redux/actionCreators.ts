import {
	UPDATE_CHALLENGE_TEXT,
	UPDATE_DEVELOPER_NAME,
	UPDATE_WELCOME_TEXT,
} from "./actionTypes";

export function actionUpdateDeveloperName(payload: any) {
	return { type: UPDATE_DEVELOPER_NAME, payload };
}

export function actionUpdateWelcomeText(payload: any) {
	return { type: UPDATE_WELCOME_TEXT, payload };
}

export function actionUpdateChallengeText(payload: any) {
	return { type: UPDATE_CHALLENGE_TEXT, payload };
}

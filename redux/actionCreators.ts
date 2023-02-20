import { UPDATE_DEVELOPER_NAME } from "./actionTypes";

export function actionUpdateDeveloperName(payload: any) {
	return { type: UPDATE_DEVELOPER_NAME, payload };
}

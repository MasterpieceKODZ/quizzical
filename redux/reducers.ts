import { generalInitialState } from "./initialStates";
export function generalReducer(
	state: any = generalInitialState,
	{ type, payload }: any,
) {
	switch (type) {
		case "UPDATE_DEVELOPER_NAME":
			return { ...state, devName: payload };
		default:
			return state;
	}
}

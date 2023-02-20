import { configureStore } from "@reduxjs/toolkit";
import { generalReducer } from "./reducers";

const reduxStore = configureStore({
	reducer: {
		appState: generalReducer,
	},
});

export type RootState = ReturnType<typeof reduxStore.getState>;
export type AppDispatch = ReturnType<typeof reduxStore.dispatch>;
export default reduxStore;

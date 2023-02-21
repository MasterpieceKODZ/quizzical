import type { AppProps } from "next/app";
import Head from "next/head";
import "@fontsource/julee";
import "@fontsource/stylish";
import "@fontsource/new-rocker";
import "@fontsource/special-elite";
import "@fontsource/wallpoet";
import "@/styles/globals.css";
import "@/styles/launch-screen.css";
import "@/styles/launch-screen-media-queries.css";
import "@/styles/welcome.css";
import { Provider } from "react-redux";
import reduxStore from "@/redux/reduxStore";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title>Quizzical</title>
				<meta
					name="description"
					content="a quiz app"
				/>
				<link
					rel="shortcut icon"
					href="/favicon.ico"
					type="image/x-icon"
				/>
			</Head>
			<Provider store={reduxStore}>
				<Component {...pageProps} />
			</Provider>
		</>
	);
}

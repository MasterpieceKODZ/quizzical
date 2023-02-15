import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

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
			<Component {...pageProps} />
		</>
	);
}

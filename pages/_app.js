import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import Script from "next/script";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Quiz Builder - Toptal</title>
        <Script src="https://cdn.tailwindcss.com"></Script>
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;

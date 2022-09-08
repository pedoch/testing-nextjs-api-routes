import "../styles/globals.css";
// import { SessionProvider } from "next-auth/react";
import { UserProvider } from "@auth0/nextjs-auth0";
import Head from "next/head";
import Script from "next/script";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <UserProvider>
      <Head>
        <title>Quiz Builder - Toptal</title>
        <Script src="https://cdn.tailwindcss.com"></Script>
      </Head>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;

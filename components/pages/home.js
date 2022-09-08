import Head from "next/head";
import React, { useEffect, useState } from "react";
// import { useSession, signOut } from "next-auth/react";
import { Button, Navbar } from "../common";
// import Link from "next/link";
import { useRouter } from "next/router";

// import { Link } from "react-router-dom";
import { ClientLink } from "../../pages/[[...path]]";
import { useUser } from "@auth0/nextjs-auth0";

export default function Home() {
  // const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const { user, error, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        window.location.href = "/login";
      } else {
        setLoading(false);
      }
    }
  }, [isLoading]);

  return (
    <div className="h-screen w-full flex justify-center p-5">
      <Head>
        <title>Quiz Builder</title>
      </Head>
      {loading || isLoading ? (
        <div className="w-full h-full flex justify-center items-center">
          <p>Loading...</p>
        </div>
      ) : error ? (
        <p>{error.message}</p>
      ) : (
        <div className="w-full max-w-6xl">
          <Navbar user={user} />
          <div className="my-5">
            <ClientLink to="quiz/form">
              <Button>New Quiz</Button>
            </ClientLink>
          </div>
          <div className="w-full mt-20 grid gap-5 xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
            <p className="col-auto">You haven't created any quizes</p>
          </div>
        </div>
      )}
    </div>
  );
}

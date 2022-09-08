import Head from "next/head";
import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "../common";
// import Link from "next/link";
import { useRouter } from "next/router";

import { Link } from "react-router-dom";
import { ClientLink } from "../../pages/[[...path]]";

export default function Home() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/login";
    }

    if (status === "authenticated") {
      setLoading(false);
    }
  }, [status]);

  return (
    <div className="h-screen w-full flex justify-center p-5">
      <Head>
        <title>Quiz Builder</title>
      </Head>
      {loading ? (
        <div className="w-full h-full flex justify-center items-center">
          <p>Loading...</p>
        </div>
      ) : (
        <div className="w-full max-w-6xl">
          <div className="w-full flex justify-between">
            <p className="text-2xl font-semibold">
              Welcome {session?.user?.name.split(" ")[0]}!
            </p>
            <div className="flex space-x-2">
              <ClientLink to="/quiz/new">
                <Button>New Quiz</Button>
              </ClientLink>
              <Button
                onClick={() => {
                  signOut();
                }}
              >
                Log out
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

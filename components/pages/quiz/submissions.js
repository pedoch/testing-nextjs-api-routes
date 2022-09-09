import Head from "next/head";
import React, { useEffect, useState } from "react";
// import { useSession, signOut } from "next-auth/react";
import { Button, Navbar } from "../../common";
// import Link from "next/link";
import { useRouter } from "next/router";

// import { Link } from "react-router-dom";
import { ClientLink } from "../../../pages/[[...path]]";
import { useUser } from "@auth0/nextjs-auth0";
import axios from "axios";

// 631a65e7789443c9d5b2a365

export default function Submissions() {
  // const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const { user, error, isLoading } = useUser();

  const fetchSubmissions = async (quizId) => {
    try {
      const { data } = await axios(`/api/quiz/submissions?quizId=${quizId}`);

      setSubmissions(data.submissions);
    } catch (error) {
      setErrorMessage(error.message || "An error occurred.");
    } finally {
      setLoadingSubmissions(false);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        window.location.href = "/login";
      } else {
        setLoading(false);

        const { quizId } = router.query;

        console.log(quizId);

        if (quizId) {
          setLoadingSubmissions(true);
          setErrorMessage("");

          fetchSubmissions(quizId);
        } else {
          window.location.href = "/";
        }
      }
    }
  }, [isLoading]);

  useEffect(() => {
    console.log(router.query);
  }, [router.query]);

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
            <Button onClick={() => (window.location.href = "quiz/form")}>
              New Quiz
            </Button>
          </div>
          {errorMessage && (
            <p className="p-3 border-red-400 text-red-400 rounded min-w-full my-4">
              {errorMessage}
            </p>
          )}
          <div className="w-full mt-10">
            {loadingSubmissions ? (
              <p className="col-auto">Loading Submissions...</p>
            ) : submissions.length < 1 ? (
              <p className="col-auto">There aren't any submissions yet...</p>
            ) : (
              <>
                {submissions.map((submission, index) => (
                  <div
                    className="p-1 rounded border flex w-full items-center"
                    key={submission._id}
                  >
                    <span className="mr-3">{index + 1}.</span>
                    <div className="w-full flex justify-between items-center">
                      <p className="text-xl font-semibold">{submission.name}</p>
                      <p>
                        <span
                          className={`${
                            (submission.score / submission.total) * 100 < 50
                              ? "text-red-400"
                              : (submission.score / submission.total) * 100 < 80
                              ? "text-yellow-400"
                              : "text-green-400"
                          }`}
                        >
                          {submission.score}
                        </span>{" "}
                        out of{" "}
                        <span className="text-green-500">
                          {submission.total || 0}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

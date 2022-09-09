import Head from "next/head";
import React, { useEffect, useState } from "react";
// import { useSession, signOut } from "next-auth/react";
import { Button, Navbar } from "../common";
// import Link from "next/link";
import { useRouter } from "next/router";

// import { Link } from "react-router-dom";
import { ClientLink } from "../../pages/[[...path]]";
import { useUser } from "@auth0/nextjs-auth0";
import axios from "axios";

export default function Home() {
  // const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const { user, error, isLoading } = useUser();

  const fetchQuizzes = async () => {
    try {
      const { data } = await axios(`/api/quizzes?userSub=${user.sub}`);

      console.log(data);

      setQuizzes(data.quizzes);
    } catch (error) {
      setErrorMessage(error.message || "An error occurred.");
    } finally {
      setLoadingQuizzes(false);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        window.location.href = "/login";
      } else {
        setLoading(false);

        setLoadingQuizzes(true);

        fetchQuizzes();
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
          {errorMessage && (
            <p className="p-3 border-red-400 text-red-400 rounded min-w-full my-4">
              {errorMessage}
            </p>
          )}
          <div className="w-full mt-20 grid gap-5 xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
            {loadingQuizzes ? (
              <p className="col-auto">Loading Quizzes...</p>
            ) : quizzes.length < 1 ? (
              <p className="col-auto">You haven't created any quizzes</p>
            ) : (
              <>
                {quizzes.map((quiz) => (
                  <div className="p-3 rounded border" key={quiz._id}>
                    <p className="text-xl font-semibold">{quiz.title}</p>
                    <p className="my-2">{quiz.quiz.length} Question(s)</p>
                    <div className="flex space-x-3 items-center justify-between">
                      {quiz.published ? (
                        <Button>View Submissions</Button>
                      ) : (
                        <Button
                          onClick={() =>
                            (window.location.href = `/quiz/form?quizId=${quiz._id}`)
                          }
                        >
                          Edit
                        </Button>
                      )}
                      <Button className="bg-red-500 text-white">Delete</Button>
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

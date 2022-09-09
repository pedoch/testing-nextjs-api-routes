import Head from "next/head";
import React, { useEffect, useState } from "react";
import { Button, Navbar, Input } from "../../common";
import { useRouter } from "next/router";
import { ClientLink } from "../../../pages/[[...path]]";
import axios from "axios";
import { checkAnswers } from "../../../utils/checkAnswers";
// import { useUser } from "@auth0/nextjs-auth0";

export default function TakeQuiz() {
  const router = useRouter();
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [quiz, setQuiz] = useState([]);
  const [name, setName] = useState("");
  const [userAnswers, setUserAnswers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [userScore, setUserScore] = useState(0);

  // const { user, error, isLoading } = useUser();

  const fetchQuiz = async (permalink) => {
    try {
      const { data } = await axios(`/api/quiz/take?permalink=${permalink}`);

      const tempUserAnswers = [];

      for (let i = 0; i < data?.quiz?.quiz?.length || 0; i++) {
        tempUserAnswers.push([]);
      }

      setQuiz(data.quiz);

      setUserAnswers(tempUserAnswers);
    } catch (error) {
      setErrorMessage(error.message || "An error occurred.");
    } finally {
      setLoadingQuizzes(false);
    }
  };

  useEffect(() => {
    const { q } = router.query;

    if (q) {
      setLoadingQuizzes(true);
      fetchQuiz(q);
    }
  }, [router.query]);

  const selectAnswer = (index, optionIndex) => {
    let newArray = [...userAnswers];

    if (quiz.quiz[index].multi) {
      const currentIndex = newArray[index].indexOf(optionIndex);
      if (currentIndex === -1) newArray[index].push(optionIndex);
      else {
        newArray[index].splice(currentIndex, 1);
      }
    } else {
      newArray[index] = [optionIndex];
    }
    setUserAnswers(newArray);
  };

  return (
    <div className="h-screen w-full flex justify-center p-5">
      <Head>
        <title>Quiz Builder</title>
      </Head>
      <div className="w-full max-w-6xl">
        <Navbar />
        <div className="my-5">
          <ClientLink to="quiz/form">
            <Button>Create Your Own Quiz</Button>
          </ClientLink>
        </div>
        {errorMessage && (
          <p className="p-3 border-red-400 text-red-400 rounded min-w-full my-4">
            {errorMessage}
          </p>
        )}
        <div className="w-full mt-20 grid gap-5 xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
          {loadingQuizzes ? (
            <p className="col-auto">Loading Quiz...</p>
          ) : !quiz ? (
            <p className="col-auto">Quiz does not exist</p>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();

                console.log("Got here");

                setSubmitting(true);
                setSubmitted(false);
                setErrorMessage("");

                let score = 0;

                let graded = [];

                try {
                  for (let i = 0; i < quiz.quiz.length || 0; i++) {
                    let gotIt100 = checkAnswers(
                      quiz.quiz[i].correct,
                      userAnswers[i]
                    );
                    if (gotIt100) {
                      graded.push(true);
                      score++;
                    } else {
                      graded.push(false);
                    }
                  }

                  setUserScore(score);

                  await axios.post("/api/quiz/take", {
                    quizId: quiz._id,
                    name,
                    score,
                    total: quiz?.quiz?.length || 0,
                  });

                  setSubmitted(true);
                } catch (error) {
                  setErrorMessage(error.message || "An error has occurred.");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              <p>You have been invited to take this quiz:</p>
              <p className="text-xl font-semibold">{quiz.title}</p>
              {submitted && (
                <p className="font-bold text-lg">
                  You scored:{" "}
                  <span
                    className={`${
                      (userScore / quiz?.quiz?.length) * 100 < 50
                        ? "text-red-400"
                        : (userScore / quiz?.quiz?.length) * 100 < 80
                        ? "text-yellow-400"
                        : "text-green-400"
                    }`}
                  >
                    {userScore}
                  </span>{" "}
                  out of{" "}
                  <span className="text-green-500">
                    {quiz?.quiz?.length || 0}
                  </span>
                </p>
              )}
              <Input
                placeholder="Enter your name"
                className="mt-5"
                disabled={submitting || submitted}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <div className="flex space-x-3 items-center justify-between">
                {quiz?.quiz?.map((question, index) => (
                  <div key={index} className="mt-5">
                    <p>{question.question}</p>
                    <ul>
                      {question.options.map((option, optionIndex) => (
                        <li
                          key={optionIndex}
                          className={
                            submitted
                              ? `${
                                  question.correct.includes(optionIndex)
                                    ? "text-green-500"
                                    : "text-red-500"
                                }`
                              : ""
                          }
                        >
                          <Input
                            type={question.multi ? "checkbox" : "radio"}
                            disabled={submitting || submitted}
                            checked={userAnswers[index].includes(optionIndex)}
                            onChange={() => selectAnswer(index, optionIndex)}
                          />{" "}
                          {option}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <Button
                className="w-full mt-5"
                disabled={submitting || submitted}
                type="submit"
              >
                {submitting ? "Submitting" : "Submit"} Quiz
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

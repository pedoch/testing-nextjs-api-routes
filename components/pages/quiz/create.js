import { useState, useEffect } from "react";
import Head from "next/head";
import { Button, Input, QuestionForm, Navbar } from "../../common";
import { useUser } from "@auth0/nextjs-auth0";
import { generatePermalink } from "../../../utils/generatePermalink";
import { useRouter } from "next/router";
import axios from "axios";

const CreateQuiz = () => {
  // const { data: session, status } = useSession();
  const router = useRouter();
  const [quizToEdit, setQuizToEdit] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [quizPermalink, setQuizPermalink] = useState("");
  const [noEdit, setNoEdit] = useState(false);

  const [questions, setQuestions] = useState([
    {
      question: "",
      options: [""],
      correct: [],
      multi: false,
    },
  ]);
  const [title, setTitle] = useState("");
  const [publish, setPublish] = useState(false);

  const { user, error, isLoading } = useUser();

  const setQuiz = (quiz) => {
    setQuestions(quiz.quiz);
    setTitle(quiz.title);
    setQuizToEdit(quiz._id);
    setPublish(quiz.published);
    setNoEdit(quiz.published);
  };

  const fetchQuiz = async (quizId) => {
    try {
      const { data } = await axios(`/api/quiz?quizId=${quizId}`);

      const quiz = data.quiz;

      setQuiz(quiz);
    } catch (error) {
      setErrorMessage(error.message || "An error has occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        window.location.href = "/login";
      } else {
        const { quizId } = router.query;

        if (!quizId) setLoading(false);
        else fetchQuiz(quizId);
      }
    }
  }, [isLoading]);

  const addQuestion = () => {
    let newArray = [...questions];
    newArray.push({
      question: "",
      options: [""],
      correct: [],
      multi: false,
    });
    setQuestions(newArray);
  };

  const deleteQuestion = (index) => {
    let newArray = [...questions];
    newArray.splice(index, 1);
    setQuestions(newArray);
  };

  const onQuestionChange = (value, index) => {
    let newArray = [...questions];
    newArray[index].question = value;
    setQuestions(newArray);
  };

  const addOption = (index) => {
    let newArray = [...questions];
    newArray[index].options.push("");
    setQuestions(newArray);
  };

  const removeOption = (index, optionIndex) => {
    let newArray = [...questions];
    newArray[index].options.splice(optionIndex, 1);
    setQuestions(newArray);
  };

  const onOptionChange = (value, index, optionIndex) => {
    let newArray = [...questions];
    newArray[index].options[optionIndex] = value;
    setQuestions(newArray);
  };

  const markAsCorrect = (index, optionIndex) => {
    let newArray = [...questions];
    if (newArray[index].multi) {
      const currentIndex = newArray[index].correct.indexOf(optionIndex);
      if (currentIndex === -1) newArray[index].correct.push(optionIndex);
      else {
        newArray[index].correct.splice(currentIndex, 1);
      }
    } else {
      newArray[index].correct = [optionIndex];
    }
    setQuestions(newArray);
  };

  const clearCorrectSelection = (index) => {
    let newArray = [...questions];
    newArray[index].correct = [];

    setQuestions(newArray);
  };

  const onMultiChange = (index) => {
    let newArray = [...questions];
    newArray[index].multi = !newArray[index].multi;
    setQuestions(newArray);

    clearCorrectSelection(index);
  };

  return (
    <div className="h-screen w-full flex justify-center p-5">
      <Head>
        <title>Quiz Builder - New Quiz</title>
      </Head>
      {loading || isLoading ? (
        <div className="w-full h-full flex justify-center items-center">
          <p>Loading...</p>
        </div>
      ) : error ? (
        <p>{error.message}</p>
      ) : (
        <div className="w-full max-w-4xl">
          <Navbar user={user} />
          <a href="/" className="mt-5 text-blue-600">
            Home
          </a>
          {noEdit && (
            <p className="text-yellow-600 font-semibold my-10 text-xl">
              QUIZ HAS BEEN PUBLISHED AND CAN NOT BE EDITED
            </p>
          )}
          <form
            className="min-w-full mt-10"
            onSubmit={async (e) => {
              e.preventDefault();

              setSubmitting(true);
              setSubmitted(false);
              setQuizPermalink("");
              setErrorMessage("");

              try {
                const formValues = {
                  title,
                  userSub: user.sub,
                  quiz: questions,
                  published: publish,
                };

                if (publish) {
                  formValues.permalink = generatePermalink();
                }

                console.log(formValues);

                let payload;

                if (quizToEdit) {
                  payload = await axios.put(
                    `/api/quiz?quizId=${quizToEdit}`,
                    formValues
                  );
                } else {
                  payload = await axios.post("/api/quiz", formValues);
                }

                console.log(payload);

                if (publish) setQuizPermalink(formValues.permalink);

                const quiz = payload.data.quiz;

                setQuiz(quiz);
                setSubmitted(true);
              } catch (error) {
                setErrorMessage(error.message || "An error has occurred.");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            <p className="font-bold flex items-center text-lg w-full">
              Title:{" "}
              <Input
                className="w-full ml-2"
                placeholder="Enter quiz title"
                disabled={noEdit}
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </p>
            {questions.map((quiz, index) => (
              <QuestionForm
                key={index}
                question={quiz}
                index={index}
                onDelete={deleteQuestion}
                onQuestionChange={onQuestionChange}
                addOption={addOption}
                removeOption={removeOption}
                onOptionChange={onOptionChange}
                markAsCorrect={markAsCorrect}
                onMultiChange={onMultiChange}
                canDelete={questions.length > 1}
                disable={noEdit}
              />
            ))}
            <div className="flex justify-end">
              {questions.length < 10 && (
                <Button
                  type="button"
                  disabled={noEdit}
                  onClick={() => addQuestion()}
                >
                  Add Question
                </Button>
              )}
            </div>
            {errorMessage && (
              <div className="p-3 border-red-400 text-red-400 rounded min-w-full my-4">
                {errorMessage}
              </div>
            )}
            {!errorMessage && submitted && quizPermalink ? (
              <div className="p-3 border-green-400 rounded min-w-full my-4">
                Share quiz: {`${window.location.origin}/q?q=${quizPermalink}`}
              </div>
            ) : (
              !errorMessage &&
              submitted && (
                <div className="p-3 border-green-400 rounded min-w-full my-4">
                  Quiz saved successfully
                </div>
              )
            )}
            <div className="flex min-w-full space-x-3 mt-10">
              <Button
                className="w-full"
                disabled={submitting || noEdit}
                type="submit"
              >
                {submitting ? "Submitting" : "Submit"} Quiz
              </Button>{" "}
              <div className="whitespace-nowrap">
                <Input
                  type="checkbox"
                  disabled={noEdit}
                  checked={publish}
                  onChange={() => setPublish(!publish)}
                />{" "}
                Publish
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateQuiz;

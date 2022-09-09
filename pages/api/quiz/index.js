import connectMongo from "../../../utils/connectMongoDB";
import Quiz from "../../../models/quiz";
import Submission from "../../../models/submission";
import Cors from "cors";
import { runMiddleware } from "../../../utils/middleware";

const cors = Cors({
  origin: "*",
  methods: ["POST", "GET", "PUT", "DELETE"],
});

export default async function quizAPI(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method === "POST") {
    try {
      await connectMongo();

      const quiz = await Quiz.create(req.body);

      return res.json({ quiz });
    } catch (error) {
      console.log(error);
      return res.json({ error });
    }
  }

  if (req.method === "PUT") {
    try {
      await connectMongo();

      const quiz = await Quiz.findById(req?.query?.quizId);

      if (quiz.published) {
        return res.status(400).json({
          error: { message: "Quiz has already been published. Can't edit" },
        });
      }

      quiz.title = req?.body?.title || quiz.title;
      quiz.quiz = req?.body?.quiz || quiz.quiz;
      quiz.published = req?.body?.published || quiz.published;
      quiz.permalink = req?.body?.permalink || quiz.permalink;

      await quiz.save();

      return res.json({ quiz });
    } catch (error) {
      console.log(error);
      return res.json({ error });
    }
  }

  if (req.method === "GET") {
    try {
      await connectMongo();

      const quiz = await Quiz.findById(req?.query?.quizId);

      return res.json({ quiz });
    } catch (error) {
      console.log(error);
      return res.json({ error });
    }
  }

  if (req.method === "DELETE") {
    try {
      await connectMongo();

      await Quiz.findByIdAndDelete(req?.query?.quizId);

      await Submission.deleteMany({ quizId: req?.query?.quizId });

      return res.json({ message: "Quiz deleted successfully" });
    } catch (error) {
      console.log(error);
      return res.json({ error });
    }
  }

  return res.status(400).json({
    error: {
      message: "Bad Request",
    },
  });
}

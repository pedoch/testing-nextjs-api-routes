import connectMongo from "../../utils/connectMongoDB";
import Quiz from "../../models/quiz";
import Cors from "cors";
import { runMiddleware } from "../../utils/middleware";

const cors = Cors({
  origin: "*",
  methods: ["POST", "GET", "PUT", "DELETE"],
});

export default async function addTest(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method === "POST") {
    try {
      await connectMongo();

      const quiz = await Quiz.create(req.body);

      res.json({ quiz });
    } catch (error) {
      console.log(error);
      res.json({ error });
    }
  }

  if (req.method === "PUT") {
    try {
      await connectMongo();

      const quiz = await Quiz.findById(req?.query?.quizId);

      if (quiz.published) {
        return res
          .status(400)
          .json({
            error: { message: "Quiz has already been published. Can't edit" },
          });
      }

      quiz.title = req?.body?.title || quiz.title;
      quiz.quiz = req?.body?.quiz || quiz.quiz;
      quiz.published = req?.body?.published || quiz.published;

      await quiz.save();

      res.json({ quiz });
    } catch (error) {
      console.log(error);
      res.json({ error });
    }
  }

  if (req.method === "GET") {
    try {
      await connectMongo();

      const quiz = await Quiz.findById(req?.query?.quizId);

      res.json({ quiz });
    } catch (error) {
      console.log(error);
      res.json({ error });
    }
  }
}

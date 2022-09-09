import connectMongo from "../../utils/connectMongoDB";
import Quiz from "../../models/quiz";
import Cors from "cors";
import { runMiddleware } from "../../utils/middleware";

const cors = Cors({
  origin: "*",
  methods: ["POST", "GET", "PUT", "DELETE"],
});

export default async function quizzesAPI(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method === "GET") {
    try {
      await connectMongo();

      const quizzes = await Quiz.find({ userSub: req?.query?.userSub });

      return res.json({ quizzes });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  }

  return res.status(400).json({
    error: {
      message: "Bad Request",
    },
  });
}

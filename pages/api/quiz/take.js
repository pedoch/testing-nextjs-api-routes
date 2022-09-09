import connectMongo from "../../../utils/connectMongoDB";
import Quiz from "../../../models/quiz";
import Submission from "../../../models/submission";
import Cors from "cors";
import { runMiddleware } from "../../../utils/middleware";

const cors = Cors({
  origin: "*",
  methods: ["POST", "GET", "PUT", "DELETE"],
});

export default async function quizzesAPI(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method === "GET") {
    try {
      await connectMongo();

      const quiz = await Quiz.findOne({ permalink: req?.query?.permalink });

      return res.json({ quiz });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  }

  if (req.method === "POST") {
    try {
      await connectMongo();

      const submission = await Submission.create(req.body);

      return res.json({ submission });
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

import connectMongo from "../../../utils/connectMongoDB";
import Submission from "../../../models/submission";
import Cors from "cors";
import { runMiddleware } from "../../../utils/middleware";

const cors = Cors({
  origin: "*",
  methods: ["GET"],
});

export default async function submissionsAPI(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method === "GET") {
    try {
      await connectMongo();

      const submissions = await Submission.find({
        quizId: req?.query?.quizId,
      }).sort({ score: 1 });

      return res.json({ submissions });
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

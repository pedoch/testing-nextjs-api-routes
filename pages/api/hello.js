// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Cors from "cors";
import { runMiddleware } from "../../utils/middleware";

const cors = Cors({
  origin: "*",
  methods: ["GET"],
});

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  res.status(200).json({ name: "John Doe" });
}

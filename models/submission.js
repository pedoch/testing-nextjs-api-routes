import { Schema, model, models } from "mongoose";

const submissionSchema = new Schema({
  quizId: {
    type: Schema.Types.ObjectId,
    ref: "quiz",
    required: true,
  },
  name: String,
  score: Number,
  total: Number,
});

const Submission = models.Submission || model("Submission", submissionSchema);

export default Submission;

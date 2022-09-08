import { Schema, model, models } from "mongoose";

const quizSchema = new Schema({
  title: String,
  userSub: String,
  quiz: [
    {
      question: String,
      options: [
        {
          type: String,
        },
      ],
      correct: [
        {
          type: Number,
        },
      ],
      multi: Boolean,
    },
  ],
  published: {
    type: Boolean,
    default: false,
  },
  permalink: String,
});

const Quiz = models.Quiz || model("Quiz", quizSchema);

export default Quiz;

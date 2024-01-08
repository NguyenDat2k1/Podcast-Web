import mongoose, { Schema, models } from "mongoose";

const quizzSchema = new Schema(
  {
    // indx: {
    //   type: String,
    //   required: true,
    // },
    ques: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Quizz = models.Quizz || mongoose.model("Quizz", quizzSchema);
export default Quizz;

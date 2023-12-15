import mongoose, { Schema, models } from "mongoose";

const historySchema = new Schema(
  {
    podcast_ID: {
      type: String,
      required: true,
    },
    user_ID: {
      type: String,
      required: true,
    },
    podcast_Name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const History = models.History || mongoose.model("History", historySchema);
export default History;

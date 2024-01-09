import mongoose, { Schema, models } from "mongoose";

const notisubSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    notification: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const notiSub = models.notiSub || mongoose.model("notiSub", notisubSchema);
export default notiSub;

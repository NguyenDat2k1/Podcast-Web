import mongoose, { Schema, models } from "mongoose";

const activitySchema = new Schema(
  {
    activity_Type: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    user_email: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Activity = models.Activity || mongoose.model("Activity", activitySchema);
export default Activity;

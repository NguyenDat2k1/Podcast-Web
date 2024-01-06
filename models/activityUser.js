import mongoose, { Schema, models } from "mongoose";

const activitySchema = new Schema(
  {
    user: {
      type: String,
      required: true,
    },
    activity: {
      type: String,
      required: true,
    },
    // datE: {
    //   type: String,
    //   required: true,
    // },
  },
  { timestamps: true }
);

const Activity = models.Activity || mongoose.model("Activity", activitySchema);
export default Activity;

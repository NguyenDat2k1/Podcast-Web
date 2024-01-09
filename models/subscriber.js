import mongoose, { Schema, models } from "mongoose";

const subSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Subscriber = models.Subscriber || mongoose.model("Subscriber", subSchema);
export default Subscriber;

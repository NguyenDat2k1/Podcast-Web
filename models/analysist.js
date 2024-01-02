import mongoose, { Schema, models } from "mongoose";

const analysistSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    id_podcast: {
      type: String,
      required: true,
    },
    datE: {
      type: String,
      required: true,
    },
    counT: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

const Analysist =
  models.Analysist || mongoose.model("Analysist", analysistSchema);
export default Analysist;

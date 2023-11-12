import mongoose, { Schema, models } from "mongoose";

const podcastSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    kind: {
      type: String,
      required: true,
    },
    ytbPath: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Podcast = models.Podcast || mongoose.model("Podcast", podcastSchema);
export default Podcast;

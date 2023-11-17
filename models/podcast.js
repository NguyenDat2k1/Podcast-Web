import mongoose, { Schema, models } from "mongoose";

const podcastSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    audioPath: {
      type: String,
      required: true,
    },
    transcriptPath: {
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

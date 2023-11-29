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
    type: {
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
    describe: {
      type: String,
      default: "Haven't describe yet",
    },
    ytbPath: {
      type: String,
      required: true,
    },
    audioDowload: {
      type: Number,
      default: 0,
    },
    scriptDowload: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Podcast = models.Podcast || mongoose.model("Podcast", podcastSchema);
export default Podcast;

import mongoose, { Schema, models } from "mongoose";

const favouriteSchema = new Schema(
  {
    podcast_ID: {
      type: String,
      required: true,
    },
    user_ID: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Favourite =
  models.Favourite || mongoose.model("Favourite", favouriteSchema);
export default Favourite;

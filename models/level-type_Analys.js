import mongoose, { Schema, models } from "mongoose";

const typeAnalysSchema = new Schema(
  {
    // level: {
    //   type: String,
    //   required: true,
    // },
    type: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const TypeAnalys =
  models.TypeAnalys || mongoose.model("TypeAnalys", typeAnalysSchema);
export default TypeAnalys;

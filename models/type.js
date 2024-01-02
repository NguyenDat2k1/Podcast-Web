import mongoose, { Schema, models } from "mongoose";

const typeSchema = new Schema(
  {
    nameType: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Type = models.Type || mongoose.model("Type", typeSchema);
export default Type;

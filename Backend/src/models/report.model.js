import mongoose, { Schema } from "mongoose";

const reportSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trashLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
      },
    },
    trashImage: {
      type: String,
      required: true,
    },
    reportStatus: {
      type: String,
      enum: ["open", "assigned", "cleaned", "expired"],
      default:"open"
    },
  },
  { timestamps: true }
);

reportSchema.index({ trashLocation: "2dsphere" });

export const Report = mongoose.model("Report", reportSchema);

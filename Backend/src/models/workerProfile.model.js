import mongoose, { Schema } from "mongoose";

const workerProfileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    govId: {
      type: String,
      required: true,
      trim: true,
    },

    vehicleNo: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    verificationStatus: {
      type: String,
      enum: ["verified", "unverified"],
      default: "unverified",
    },

    availabilityStatus: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },

    lastLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
      },
    },
  },
  { timestamps: true }
);

workerProfileSchema.index({ lastLocation: "2dsphere" });

export const WorkerProfile = mongoose.model(
  "WorkerProfile",
  workerProfileSchema
);

import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    report: {
      type: Schema.Types.ObjectId,
      ref: "Report",
      required: true,
    },

    workerProfile: {
      type: Schema.Types.ObjectId,
      ref: "WorkerProfile",
      required: true,
    },

    status: {
      type: String,
      enum: ["assigned", "completed", "failed"],
      default: "assigned",
    },

    beforeImage: {
      type: String,
    },

    afterImage: {
      type: String,
    },

    deadline: {
      type: Date, // assignedAt + 24h
      required: true,
    },
  },
  { timestamps: true }
);

/* One active task per report */
taskSchema.index(
  { report: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "assigned" } }
);

export const Task = mongoose.model("Task", taskSchema);

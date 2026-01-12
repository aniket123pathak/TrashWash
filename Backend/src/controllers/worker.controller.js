import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { Report } from "../models/report.model.js";
import { WorkerProfile } from "../models/workerProfile.model.js";
import { Task } from "../models/task.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import turf from "@turf/turf"

const getNearbyReports = asyncHandler(async (req, res) => {
  const reports = await Report.find({
    reportStatus: "open",
  });


  return res
    .status(200)
    .json(new apiResponse(200, reports, "Reports successfully fetched"));
});

const acceptTask = asyncHandler(async (req, res) => {
  const { reportId } = req.params;

  const curReport = await Report.findById(reportId);

  if (!curReport) {
    throw new apiError(400, "Report not found");
  }

  if (curReport.reportStatus === "open") {
    throw new apiError(400, "Report Task is already created");
  }

  const curWorker = await WorkerProfile.find({
    user: req.user._id,
  });

  if (!curWorker) {
    throw new apiError(400, "Worker Not Found!!!!!!!!!");
  }

  const curTask = await Task.create({
    report: curReport._id,
    workerProfile: curWorker._id,
    status: "assigned",
  });

  if (!curTask) {
    throw new apiError(400, "Failed to create task");
  }

  curReport.reportStatus = "assigned";
  await curReport.save();

  return res
    .status(200)
    .json(new apiResponse(200, curTask, "Task Accepted Successfully"));
});

const myTasks = asyncHandler(async (req, res) => {
  const worker = await WorkerProfile.findOne({
    user: req.user._id,
  });
  if (!worker) {
    throw new apiError(400, "Worker Not Found");
  }

  const curTask = await Task.find({
    workerProfile: worker._id,
  });

  if (!curTask) {
    throw new apiError(400, "Tasks not found..");
  }

  return res
    .status(200)
    .json(new apiResponse(200, curTask, "Tasks Fetched Successfully"));
});

const markTaskAsCompleted = asyncHandler(async (req, res) => {
  const { curTaskId } = req.params;
  const curTask = await Task.findById(curTaskId);
  if (!curTask) {
    throw new apiError(404, "Task not found.");
  }

  if (!req.files || !req.files.beforeImage || !req.files.afterImage) {
    throw new apiError(400, "Images Not Found..");
  }

  const beforeImageLocalPath = req.files.beforeImage[0].path;
  const afterImageLocalPath = req.files.afterImage[0].path;

  if (!beforeImageLocalPath || !afterImageLocalPath) {
    throw new apiError(400, "Images file path required..");
  }

  const beforeImage = await uploadOnCloudinary(beforeImageLocalPath);
  const afterImage = await uploadOnCloudinary(afterImageLocalPath);

  if (!beforeImage || !afterImage) {
    throw new apiError(400, "Image upload failed..");
  }

  const curReport = await Report.findById(curTask.report._id);

  if (!curReport) {
    throw new apiError(400, "Report Not Found");
  }

  curTask.beforeImage = beforeImage.url;
  curTask.afterImage = afterImage.url;
  curTask.status = "completed";
  await curTask.save();

  curReport.reportStatus = "cleaned";
  await curReport.save();

  return res.status(200).json(
    new apiResponse(
      200,
      {
        taskStatus: curTask.status,
        reportStatus: curReport.reportStatus,
      },
      "Task Completed Successfully.."
    )
  );
});

export { getNearbyReports, acceptTask, myTasks, markTaskAsCompleted };

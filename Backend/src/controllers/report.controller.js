import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { Report } from "../models/report.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const reportTrash = asyncHandler(async (req, res) => {
  const trashLocation = JSON.parse(req.body.trashLocation); //trashLocation=[longitude,latitude] longi=[-180,180] lati = [-90,90]

  if (
    !trashLocation ||
    !Array.isArray(trashLocation) ||
    trashLocation.length !== 2
  ) {
    throw new apiError(400, "Trash location is required");
  }

  if (!(trashLocation[0] >= -180 && trashLocation[0] <= 180)) {
    throw new apiError(400, "False Location detected");
  }
  if (!(trashLocation[1] >= -90 && trashLocation[1] <= 90)) {
    throw new apiError(400, "False Location detected");
  }

  if (!req.files || !req.files.trashImage || !req.files.trashImage[0]) {
    throw new apiError(400, "Trash image is required");
  }

  const trashImageLocalPath = req.files.trashImage[0].path;

  if (!trashImageLocalPath) {
    throw new apiError(500, "No local path");
  }

  const trashImage = await uploadOnCloudinary(trashImageLocalPath);

  if (!trashImage) {
    throw new apiError(500, "Image upload failed");
  }

  const report = await Report.create({
    user: req.user._id,
    trashLocation: {
      type: "Point",
      coordinates: [trashLocation[0], trashLocation[1]],
    },
    trashImage: trashImage.url,
    reportStatus: "open",
  });

  if (!report) {
    throw new apiError(500, "Report Not created");
  }

  return res.status(201).json(
    new apiResponse(
      201,
      {
        reportId: report._id,
        reportStatus: report.reportStatus,
      },
      "Report Has Been Created Successfully"
    )
  );
});

export { reportTrash };

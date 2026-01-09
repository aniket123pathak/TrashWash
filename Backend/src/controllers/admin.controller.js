import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { WorkerProfile } from "../models/workerProfile.model.js";

const getWorkerReq = asyncHandler(async (_, res) => {
  const unverifiedWorkerProfiles = await WorkerProfile.find({
    verificationStatus: "unverified",
  });

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        unverifiedWorkerProfiles,
        "Successfully got the worker profiles"
      )
    );
});

const approvWorkerReq = asyncHandler(async (req, res) => {
  const { workerProfileId } = req.params;

  const curWorkerProfile = await WorkerProfile.findById(workerProfileId);

  if (!curWorkerProfile) {
    throw new apiError(400, "Worker Profile not found");
  }

  if (curWorkerProfile.verificationStatus == "verified") {
    throw new apiError(400, "Worker is already verified");
  }

  curWorkerProfile.verificationStatus = "verified";
  await curWorkerProfile.save();

  const user = await User.findById(curWorkerProfile.user);

  if (!user) {
    throw new apiError(400, "Associated User not found..");
  }

  user.role = "worker";
  await user.save();

  return res.status(200).json(
    new apiResponse(
      200,
      {
        workerProfileId: curWorkerProfile._id,
        userId: user._id,
        role: user.role,
        verificationStatus: curWorkerProfile.verificationStatus,
      },
      "Worker approved successfully"
    )
  );
});

export { getWorkerReq, approvWorkerReq };

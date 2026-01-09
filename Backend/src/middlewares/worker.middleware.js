import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const isWorker = asyncHandler(async (req, _, next) => {
  if (req.user.role != "worker") {
    throw new apiError(403, "Authorization Failed");
  }
  next();
});

import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const isAdmin = asyncHandler(async (req, _, next) => {
  if (req.user.role != "admin") {
    throw new apiError(403, "Authorization Failed");
  }
  next();
});

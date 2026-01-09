import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { WorkerProfile } from "../models/workerProfile.model.js";

const workerProfileCont = asyncHandler(async(req,res)=>{
    const { govId , vehicleNo } = req.body;

    const user = await User.findById(req.user._id);

    if(!user){
      throw new apiError(400,"User Doesnt exist.")
    }

    if(user.role==="worker"){
        throw new apiError(400,"User is Already A worker");
    }

    const existedWorkerProfile = await WorkerProfile.findOne({
      user:user._id
    });

    if(existedWorkerProfile){
      throw new apiError(400,"Already a worker..")
    }

    if (!govId || !vehicleNo ) {
    throw new apiError(400, "Fill Every Field..");
  }

  if ([govId,vehicleNo].some((fields) => fields?.trim() === "")) {
    throw new apiError(400, "Fill Every Field..");
  }

  const worker = await WorkerProfile.create({
    User : user._id,
    govId,
    vehicleNo,
    availabilityStatus :"inactive",
    verificationStatus : "unverified"
  });

  if(!worker){
    throw new apiError(500,"Unable to create the worker profile")
  }

  return res
  .status(201)
  .json(
    new apiResponse(
      201,
      {
        workerId:worker._id,
        verificationStatus:worker.verificationStatus,
        availabilityStatus:worker.availabilityStatus
      },
      "Worker Proile request has been created"
    )
  )

  
});

export { workerProfileCont };
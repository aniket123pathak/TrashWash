import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getWorkerReq,approvWorkerReq } from "../controllers/admin.controller.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

const adminRouter = Router();

adminRouter.route("/getWorkerReq").get(verifyJWT,isAdmin,getWorkerReq);
adminRouter.route("/approveWorkerReq/:workerProfileId").patch(verifyJWT,isAdmin,approvWorkerReq);

export { adminRouter }
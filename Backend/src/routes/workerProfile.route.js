import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { workerProfileCont } from "../controllers/workerProfile.controller.js";

const workerProfileRouter = Router();


workerProfileRouter.route("/applyForWorkerProfile").post(verifyJWT,workerProfileCont);

export { workerProfileRouter };
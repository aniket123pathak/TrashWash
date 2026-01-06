import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { workerProfile } from "../controllers/workerProfile.controller.js";

const workerRouter = Router();


workerRouter.route("/applyForWorkerProfile").post(verifyJWT,workerProfile);

export { workerRouter };
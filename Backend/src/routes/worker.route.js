import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isWorker } from "../middlewares/worker.middleware.js";
import { getNearbyReports , acceptTask } from "../controllers/worker.controller.js";

const workerRouter = Router();

workerRouter.route("/getReports").get(verifyJWT,isWorker,getNearbyReports);
workerRouter.route("/accept").get(verifyJWT,isWorker,acceptTask);
export { workerRouter }
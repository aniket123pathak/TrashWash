import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isWorker } from "../middlewares/worker.middleware.js";
import {
  getNearbyReports,
  acceptTask,
  myTasks,
  markTaskAsCompleted,
} from "../controllers/worker.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const workerRouter = Router();

workerRouter.route("/getReports").get(verifyJWT, isWorker, getNearbyReports);
workerRouter.route("/accept/:reportId").patch(verifyJWT, isWorker, acceptTask);
workerRouter.route("/myTasks").get(verifyJWT, isWorker, myTasks);
workerRouter.route("/markAsComlete/:curTaskId").post(
  verifyJWT,
  isWorker,
  upload.fields([
    {
      name: "beforeImage",
      maxCount: 1,
    },
    {
        name : "afterImage",
        maxCount : 1
    },
  ]),
  markTaskAsCompleted
);
export { workerRouter };

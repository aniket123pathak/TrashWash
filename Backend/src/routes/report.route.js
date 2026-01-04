import { Router } from "express";
import { reportTrash } from "../controllers/report.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const reportRouter = Router();

reportRouter
  .route("/report")
  .post(
    verifyJWT,
    upload.fields([{ name: "trashImage", maxCount: 1 }]),
    reportTrash
  );

export { reportRouter };

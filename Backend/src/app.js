import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import { userRouter } from "./routes/user.route.js";
import { reportRouter } from "./routes/report.route.js";
import { workerRouter } from "./routes/workerProfile.route.js";
import { adminRouter } from "./routes/admin.route.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/user", reportRouter);
app.use("/api/v1/user",workerRouter);
app.use("/api/v1/admin",adminRouter);


export { app };

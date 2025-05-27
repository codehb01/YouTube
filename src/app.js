import express from "express";
import cors from "cors";

const app = express();

// common middleware
// middlewares are writtern after app intialization
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// import routes
import healthcheckRouter from "./routes/healthcheck.routes.js";

// create routes
app.use("/api/v1/healthcheck",healthcheckRouter);

export { app };

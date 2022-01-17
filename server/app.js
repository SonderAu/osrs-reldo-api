import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import indexRouter from "./routes/index";
import hiscoresRouter from "./routes/hiscores";
import feedbackRouter from "./routes/feedback";
import customEnv from "custom-env";

customEnv.env();
var app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGINS.split(", "),
    })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));
app.use("/", indexRouter);
app.use("/hiscores", hiscoresRouter);
app.use("/feedback", feedbackRouter);

export default app;

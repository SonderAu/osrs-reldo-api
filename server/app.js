import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import indexRouter from "./routes/index";
import hiscoresRouter from "./routes/hiscores";
import feedbackRouter from "./routes/feedback";
import customEnv from "custom-env";
import PostgresClient from "./routes/feedback";

customEnv.env();
var app = express();

const corsConfig = {
    // origin: process.env.CORS_ORIGINS.split(", "),
    origin: "*",
    optionsSuccessStatus: 200,
};

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));
app.use("/", indexRouter);
app.use("/hiscores", hiscoresRouter);
app.use("/feedback", feedbackRouter);

PostgresClient.init();

export default app;

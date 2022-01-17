import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import indexRouter from "./routes/index";
import hiscoresRouter from "./routes/hiscores";

var app = express();

app.use(
    cors({
        origin: ["https://osleague.tools", /\.osleague\.tools$/],
    })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));
app.use("/", indexRouter);
app.use("/hiscores", hiscoresRouter);

export default app;

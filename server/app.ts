import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/index';
import hiscoresRouter from './routes/hiscores';
import feedbackRouter from './routes/feedback';
import userRouter from './routes/users';
import customEnv from 'custom-env';
import dotenv from 'dotenv';

customEnv.env();
dotenv.config();
const app = express();

const corsConfig = {
  origin: process.env.CORS_ORIGIN ?? '',
  optionsSuccessStatus: 200,
};

app.use(cors(corsConfig));
app.options('*', cors(corsConfig));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/', indexRouter);
app.use('/hiscores', hiscoresRouter);
app.use('/feedback', feedbackRouter);
app.use('/user', userRouter);

export default app;

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
import { auth } from 'express-oauth2-jwt-bearer';

customEnv.env();
dotenv.config();
const app = express();

const corsConfig = {
  origin: process.env.CORS_ORIGIN ?? '',
  optionsSuccessStatus: 200,
};

const jwtCheck = auth({
  issuerBaseURL: process.env.ISSUER_BASE_URL ?? '',
  audience: process.env.AUDIENCE ?? '',
});

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
app.use(
  '/user',
  (req, res, next) => {
    // Don't require auth for readonly queries
    if (req.method === 'GET') {
      next();
      return;
    }

    // Skip bearer auth if valid alternate api key is provided
    if (req.headers['api-key']) {
      const validKeys = (process.env.VALID_API_KEYS ?? '').split(', ');
      for (const key of validKeys) {
        if (key === req.headers['api-key']) {
          next();
        }
        res.status(401).send('Unauthorized API key');
      }
    } else {
      jwtCheck(req, res, next);
    }
  },
  userRouter,
);

export default app;

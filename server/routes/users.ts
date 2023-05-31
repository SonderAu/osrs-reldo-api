import express from 'express';
import { DynamoDbClient } from '../client/dynamoDbClient';
const router = express.Router();

const dynamoDbClient = new DynamoDbClient();

router.post('/', function (req, res) {
  const { email, rsn } = req.query;
  if (typeof email !== 'string' || typeof rsn !== 'string') {
    throw new Error(
      `Invalid input: ${email?.toString() ?? ''}, ${rsn?.toString() ?? ''}`,
    );
  }
  dynamoDbClient.createUser(email, rsn);
});

router.get('/', function (req, res) {
  const { email, rsn } = req.query;
  if (typeof email !== 'string' || typeof rsn !== 'string') {
    throw new Error(
      `Invalid input: ${email?.toString() ?? ''}, ${rsn?.toString() ?? ''}`,
    );
  }
  dynamoDbClient.getUser(email, rsn);
});

export default router;

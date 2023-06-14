import express from 'express';
import { DynamoDbClient } from '../client/dynamoDbClient';
const router = express.Router();

const dynamoDbClient = new DynamoDbClient();

router.options('/', function (req, res) {
  res.status(200).send();
});

/**
 * Create an empty user record
 */
router.post('/', function (req, res) {
  const { email, rsn } = req.query;
  if (typeof email !== 'string' || (!!rsn && typeof rsn !== 'string')) {
    res.status(400).send();
    return;
  }

  try {
    dynamoDbClient.createUser(email, rsn, (response) => {
      res.status(201).send(`User ${email} was created`);
    });
  } catch (e) {
    res.status(500).send(`Internal Error: ${e as string}`);
  }
});

/**
 * Create or update a key-value pair within a user record
 */
router.put('/', function (req, res) {
  const { email, rsn, key } = req.query;
  if (
    typeof email !== 'string' ||
    (!!rsn && typeof rsn !== 'string') ||
    typeof key !== 'string'
  ) {
    res.status(400).send();
    return;
  }

  try {
    dynamoDbClient.updateUser(email, rsn, key, req.body, (response) => {
      res.status(201).send(`User ${email} was updated`);
    });
  } catch (e) {
    res.status(500).send(`Internal Error: ${e as string}`);
  }
});

/**
 * Retrieve an entire user record, or a specific key within it.
 */
router.get('/', function (req, res) {
  const { email, rsn, key } = req.query;
  if (
    (!email && !rsn) ||
    (!!email && typeof email !== 'string') ||
    (!!rsn && typeof rsn !== 'string') ||
    (key !== undefined && typeof key !== 'string')
  ) {
    res.status(400).send();
    return;
  }

  try {
    dynamoDbClient.getUser(email, rsn, (response) => {
      console.log({ response });
      if (!response?.Item) {
        res.status(404).send(`User ${email ?? rsn ?? 'UNKNOWN'} not found`);
        return;
      }

      let responseContent = response.Item;
      if (key) {
        const value = response.Item[key]?.S;
        if (!value) {
          res.status(404).send(`No data found for key ${key}.`);
          return;
        }
        responseContent = JSON.parse(value);
      }
      res.status(201).send(responseContent);
    });
  } catch (e) {
    res.status(500).send(`Internal Error: ${e as string}`);
  }
});

export default router;

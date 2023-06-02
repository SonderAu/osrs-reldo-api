import express from 'express';
import { DynamoDbClient } from '../client/dynamoDbClient';
const router = express.Router();

const dynamoDbClient = new DynamoDbClient();

/**
 * Create an empty user record
 */
router.post('/', function (req, res) {
  const { email } = req.query;
  if (typeof email !== 'string') {
    res.status(400).send();
    return;
  }

  try {
    dynamoDbClient.createUser(email, (response) => {
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
  const { email, key } = req.query;
  if (typeof email !== 'string' || typeof key !== 'string') {
    res.status(400).send();
    return;
  }

  try {
    dynamoDbClient.putUser(email, key, req.body, (response) => {
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
  const { email, key } = req.query;
  if (
    typeof email !== 'string' ||
    (key !== undefined && typeof key !== 'string')
  ) {
    res.status(400).send();
    return;
  }

  try {
    dynamoDbClient.getUser(email, (response) => {
      console.log({ response });
      if (!response?.Item) {
        res.status(404).send(`User ${email} not found`);
        return;
      }

      let responseContent = response.Item;
      if (key) {
        const value = response.Item[key].S;
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

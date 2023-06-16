import AWS from 'aws-sdk';
import dotenv from 'dotenv';

const DEFAULT_RSN = 'default';

export class DynamoDbClient {
  private readonly client;

  constructor() {
    dotenv.config();
    AWS.config.update({
      region: process.env.DDB_REGION ?? 'us-west-2',
      credentials: {
        accessKeyId: process.env.DDB_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.DDB_SECRET_ACCESS_KEY ?? '',
      },
    });
    this.client = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
  }

  createUser(
    email: string,
    rsn: string | undefined,
    responseHandler: (response: AWS.DynamoDB.GetItemOutput | null) => void,
  ): void {
    const params = {
      TableName: process.env.DDB_USERS_TABLE_NAME ?? '',
      Item: {
        email: { S: email },
        rsn: { S: rsn ?? DEFAULT_RSN },
      },
    };

    this.client.putItem(
      params,
      (err: AWS.AWSError | null, data: AWS.DynamoDB.PutItemOutput | null) => {
        if (err !== null) {
          console.log('Error', err);
          throw new Error(err.message);
        } else {
          console.log('Success', data);
          responseHandler(data);
        }
      },
    );
  }

  getUser(
    email: string | undefined,
    rsn: string | undefined,
    responseHandler: (response: AWS.DynamoDB.GetItemOutput | null) => void,
  ): void {
    const params: any = {
      Key: {
        rsn: {
          S: rsn ?? DEFAULT_RSN,
        },
      },
      TableName: process.env.DDB_USERS_TABLE_NAME ?? '',
    };

    if (email) {
      params.Key.email = {
        S: email,
      };
    }

    this.client.getItem(
      params,
      (err: AWS.AWSError | null, data: AWS.DynamoDB.GetItemOutput | null) => {
        if (err !== null) {
          console.log('Error', err);
          throw new Error(err.message);
        } else {
          console.log('Success', data);
          responseHandler(data);
        }
      },
    );
  }

  getUserByRsn(
    rsn: string,
    responseHandler: (response: AWS.DynamoDB.ScanOutput | null) => void,
  ): void {
    const params: any = {
      FilterExpression: `attribute_exists(tasks_${rsn})`,
      TableName: process.env.DDB_USERS_TABLE_NAME ?? '',
    };

    this.client.scan(
      params,
      (err: AWS.AWSError | null, data: AWS.DynamoDB.GetItemOutput | null) => {
        if (err !== null) {
          console.log('Error', err);
          throw new Error(err.message);
        } else {
          console.log('Success', data);
          responseHandler(data);
        }
      },
    );
  }

  putUser(
    email: string,
    rsn: string | undefined,
    key: string,
    payload: string,
    responseHandler: (response: AWS.DynamoDB.GetItemOutput | null) => void,
  ): void {
    const params = {
      TableName: process.env.DDB_USERS_TABLE_NAME ?? '',
      Item: {
        email: { S: email },
        rsn: { S: rsn ?? DEFAULT_RSN },
        [key]: { S: JSON.stringify(payload) },
      },
    };

    this.client.putItem(
      params,
      (err: AWS.AWSError | null, data: AWS.DynamoDB.PutItemOutput | null) => {
        if (err !== null) {
          console.log('Error', err);
          throw new Error(err.message);
        } else {
          console.log('Success', data);
          responseHandler(data);
        }
      },
    );
  }

  updateUser(
    email: string,
    rsn: string | undefined,
    key: string,
    payload: string,
    responseHandler: (response: AWS.DynamoDB.GetItemOutput | null) => void,
  ): void {
    const params = {
      ExpressionAttributeNames: {
        '#Key': key,
      },
      ExpressionAttributeValues: {
        ':value': {
          S: JSON.stringify(payload),
        },
      },
      Key: {
        email: { S: email },
        rsn: { S: rsn ?? DEFAULT_RSN },
      },
      ReturnValues: 'ALL_NEW',
      TableName: process.env.DDB_USERS_TABLE_NAME ?? '',
      UpdateExpression: 'SET #Key = :value',
    };
    this.client.updateItem(
      params,
      (err: AWS.AWSError | null, data: AWS.DynamoDB.PutItemOutput | null) => {
        if (err !== null) {
          console.log('Error', err);
          throw new Error(err.message);
        } else {
          console.log('Success', data);
          responseHandler(data);
        }
      },
    );
  }
}

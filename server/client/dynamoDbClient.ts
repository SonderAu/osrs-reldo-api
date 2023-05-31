import AWS from 'aws-sdk';
import dotenv from 'dotenv';

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

  createUser(email: string, rsn: string): void {
    const params = {
      TableName: process.env.DDB_USERS_TABLE_NAME ?? '',
      Item: {
        email: { S: email },
        rsn: { S: rsn },
      },
    };
    this.client.putItem(
      params,
      (err: AWS.AWSError | null, data: AWS.DynamoDB.PutItemOutput | null) => {
        if (err !== null) {
          console.log('Error', err);
        } else {
          console.log('Success', data);
        }
      },
    );
  }

  getUser(email: string, rsn: string): AWS.DynamoDB.PutItemOutput | null {
    const params = {
      Key: {
        email: {
          S: email,
        },
        rsn: {
          S: rsn,
        },
      },
      TableName: process.env.DDB_USERS_TABLE_NAME ?? '',
    };
    let result = null;
    this.client.getItem(
      params,
      (err: AWS.AWSError | null, data: AWS.DynamoDB.PutItemOutput | null) => {
        if (err !== null) {
          console.log('Error', err);
        } else {
          console.log('Success', data);
          result = data;
        }
      },
    );
    return result;
  }
}

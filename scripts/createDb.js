const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({
  region: process.env.DDB_REGION ?? 'us-west-2',
  credentials: {
    accessKeyId: process.env.DDB_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.DDB_SECRET_ACCESS_KEY ?? '',
  },
});
const ddbClient = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

/* users tables */
const baseParamsUsers = {
  AttributeDefinitions: [
    {
      AttributeName: 'email',
      AttributeType: 'S',
    },
    {
      AttributeName: 'rsn',
      AttributeType: 'S',
    },
  ],
  KeySchema: [
    {
      AttributeName: 'email',
      KeyType: 'HASH',
    },
    {
      AttributeName: 'rsn',
      KeyType: 'RANGE',
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5,
  },
};

ddbClient.createTable(
  { ...baseParamsUsers, TableName: 'reldo-users' },
  function (err, data) {
    if (err) {
      console.log('Error', err);
    } else {
      console.log('Table Created', data);
    }
  },
);

ddbClient.createTable(
  { ...baseParamsUsers, TableName: 'reldo-users-dev' },
  function (err, data) {
    if (err) {
      console.log('Error', err);
    } else {
      console.log('Table Created', data);
    }
  },
);

# O S R S - R E L D O - A P I

![reldo](/docs/reldo.png)

Backend API for use with [os-league-tools](https://github.com/osrs-reldo/os-league-tools).

## Development

1. Install packages:

   - `npm install`

2. Set up `.env` file:

   - Make a copy of `/.env.example` and rename it to `/.env.development`
   - Any fields with the value `"example"` will need to be replaced with valid values in order to function correctly. Not all routes need env vars.
     - `/hiscores` routes do not require any env vars
     - `/feedback` routes require all `HEIGHT_*` vars to be correctly filled out. See [Height API documentation](https://www.notion.so/API-documentation-643aea5bf01742de9232e5971cb4afda) for more info on the keys and IDs used in task creation.
     - `/user` routes require all `DDB_*` vars to be filled out. You will need an AWS account and an IAM user with DynamoDB read/write permissions.

3. Initialize database:

   - Skip this step if you don't intend to use any DB features (`/user` routes).
   - `npm run init-db`
   - This will create a table `reldo-users` (prod) and `reldo-users-dev` (development)

4. Start app:

   - `npm run dev`

5. API will be running at http://localhost:8080/

## Usage

### `/hiscores`

#### **GET** `/hiscores/:rsn`

Returns leagues hiscores for the given RSN, formatted as JSON using [osrs-json-hiscores](https://github.com/maxswa/osrs-json-hiscores#what-youll-get).

Use query param `mode` to get hiscores for a different gamemode. Valid options:

- seasonal (default)
- main
- ironman
- hardcore
- ultimate

### `/user`

#### **POST** `/user?email=:email`

Create a new empty user record.

Response codes:

- 201 Successful
- 400 Missing or improperly formatted email
- 500 Internal server error

#### **PUT** `/user?email=:email&key=:key`

Create or update a key-value pair within a user record. Request body should be in the form of a JSON payload to be stored under the given key.

Response codes:

- 201 Successful
- 400 Missing email or improperly formatted email/key
- 500 Internal server error

#### **GET** `/user?email=:email&key=:key`

Retrieve data from a user record. Key is optional - if no key is provided, the entire dynamoDB record will be returned.

Response codes:

- 201 Successful
- 400 Missing email or improperly formatted email/key
- 404 No user record found, or no data found for the given key
- 500 Internal server error

### `/feedback`

#### **POST** `/feedback`

Sends general feedback to Height _#feedback_ list.

Request body:

```
{
    "description": string,
}
```

#### **POST** `/feedback/suggestion`

Sends a suggestion to Height _#suggestions_ list.

Request body:

```
{
    "description": string,
}
```

#### **POST** `/feedback/bug`

Sends a bug report to Height _#bugs_ list.

Request body:

```
{
    "description": string,
    "reproSteps": string,
    "device": string,
    "browser": string,
    "client": string,
}
```

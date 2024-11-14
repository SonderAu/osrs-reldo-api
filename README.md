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

3. Start app:

   - `npm run dev`

4. API will be running at http://localhost:8080/


5. User Registration and Authentication relies upon a database server, either in PostGres or MySQL, the query to create the relevant tables are below;

PostGres:

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

MySQL:

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,   
    salt VARCHAR(255) NOT NULL,            
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


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
  // Required
  "description": string,

  // Optional
  "reproSteps": string,
  "device": string,
  "client": string,
  "debugInfo": string,
}
```

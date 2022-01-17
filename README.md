# O S R S - R E L D O - A P I

![reldo](/docs/reldo.png)

Backend API for use with [os-league-tools](https://github.com/osrs-reldo/os-league-tools).

## Development

1. Install packages:

    - `npm install`

2. Set up `.env` file:

    - Make a copy of `/.env.example` and rename it to `/.env.development`

3. Start app and watch for changes:

    - `npm run start:dev`

4. API will be running at http://localhost:8080/

## Usage

### GET `hiscores/:rsn`

Returns leagues hiscores for the given RSN, formatted as JSON using [osrs-json-hiscores](https://github.com/maxswa/osrs-json-hiscores#what-youll-get).

Use query param `mode` to get hiscores for a different gamemode. Valid options:

-   seasonal (default)
-   main
-   ironman
-   hardcore
-   ultimate

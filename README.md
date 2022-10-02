<p align="center">
  <a href="http://aikenahac.com/" target="_blank"><img src="https://s3.eu-central-1.wasabisys.com/socialko/logo.svg" style="border-radius: 25px" width="200" alt="Nest Logo" /></a>
</p>

<p align="center">Backend for Socialko, an open source social media app.</p>

## Other repositories

Other repositories regarding Socialko, can be found [here](https://github.com/SocialkoApp).

## Installation

```bash
npm install
```

## Environment variables

```
DATABASE_URL="db://username:password@URL"

JWT_SECRET=""
EMAIL_CONFIRM_SECRET=""
FORGOT_PASSWORD_SECRET=""

MAIL_HOST="mail.aerio.cloud"
MAIL_USER="socialko@aikenahac.com"
MAIL_PASSWORD=""
MAIL_FROM="socialko@aikenahac.com"

MAIL_CONFIRM_URL=""
MAIL_FORGOT_PASSWORD_URL=""

S3_BUCKET=
S3_REGION=eu-central-1
S3_ACCESS_KEY=
S3_SECRET_KEY=
S3_ENDPOINT=s3.eu-central-1.wasabisys.com

SWAGGER_TITLE="Socialko API"

SWAGGER_CONTACT_NAME="Aiken Tine Ahac"
SWAGGER_CONTACT_WEBSITE="https://aikenahac.com"
SWAGGER_CONTACT_EMAIL="ahac.aiken@gmail.com"

SWAGGER_DESCRIPTION="Socialko API Documentation"
SWAGGER_API_VERSION="0.0.1"
SWAGGER_TAG="socialko"
```

## API Documentation

API documentation is available on the `/api` endpoint when running the backend locally.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

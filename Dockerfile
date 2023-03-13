FROM node:latest

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml tsconfig.json ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN npx prisma migrate deploy
RUN npx prisma generate
RUN pnpm build

## Arguments ##

ARG DATABASE_URL

ARG JWT_SECRET
ARG EMAIL_CONFIRM_SECRET
ARG FORGOT_PASSWORD_SECRET

ARG MAIL_HOST=mail.aerio.cloud
ARG MAIL_USER=socialko@aikenahac.com
ARG MAIL_PASSWORD
ARG MAIL_FROM=socialko@aikenahac.com

ARG MAIL_CONFIRM_URL=https://socialko.netlify.app/confirm-email
ARG MAIL_FORGOT_PASSWORD_URL=https://socialko.netlify.app/forgot-password

ARG S3_BUCKET
ARG S3_REGION=eu-central-1
ARG S3_ACCESS_KEY
ARG S3_SECRET_KEY
ARG S3_ENDPOINT=s3.eu-central-1.wasabisys.com

ARG SWAGGER_TITLE=Socialko API

ARG SWAGGER_CONTACT_NAME=Aiken Tine Ahac
ARG SWAGGER_CONTACT_WEBSITE=https://aikenahac.com
ARG SWAGGER_CONTACT_EMAIL=ahac.aiken@gmail.com

ARG SWAGGER_DESCRIPTION=Socialko API Documentation
ARG SWAGGER_API_VERSION=1.0.0
ARG SWAGGER_TAG=socialko

## Environment variables ##

ENV DATABASE_URL $DATABASE_URL

ENV JWT_SECRET $JWT_SECRET
ENV EMAIL_CONFIRM_SECRET $EMAIL_CONFIRM_SECRET
ENV FORGOT_PASSWORD_SECRET $FORGOT_PASSWORD_SECRET

ENV MAIL_HOST $MAIL_HOST
ENV MAIL_USER $MAIL_USER
ENV MAIL_PASSWORD $MAIL_PASSWORD
ENV MAIL_FROM $MAIL_FROM

ENV MAIL_CONFIRM_URL $MAIL_CONFIRM_URL
ENV MAIL_FORGOT_PASSWORD_URL $MAIL_FORGOT_PASSWORD_URL

ENV S3_BUCKET $S3_BUCKET
ENV S3_REGION $S3_REGION
ENV S3_ACCESS_KEY $S3_ACCESS_KEY
ENV S3_SECRET_KEY $S3_SECRET_KEY
ENV S3_ENDPOINT $S3_ENDPOINT

ENV SWAGGER_TITLE $SWAGGER_TITLE

ENV SWAGGER_CONTACT_NAME $SWAGGER_CONTACT_NAME
ENV SWAGGER_CONTACT_WEBSITE $SWAGGER_CONTACT_WEBSITE
ENV SWAGGER_CONTACT_EMAIL $SWAGGER_CONTACT_EMAIL

ENV SWAGGER_DESCRIPTION $SWAGGER_DESCRIPTION
ENV SWAGGER_API_VERSION $SWAGGER_API_VERSION 
ENV SWAGGER_TAG $SWAGGER_TAG

## Port exposure ##

EXPOSE 4000 

CMD [ "pnpm", "start:prod" ]
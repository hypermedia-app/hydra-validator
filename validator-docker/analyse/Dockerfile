FROM node:lts-alpine

WORKDIR /hydra-validator

ADD package*.json ./
RUN npm ci

ENTRYPOINT node_modules/.bin/hydra-validator analyse $ENTRYPOINT_URL

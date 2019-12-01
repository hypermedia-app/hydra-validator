FROM openjdk:8

RUN apt-get install -y curl \
  && curl -sL https://deb.nodesource.com/setup_13.x | bash - \
  && apt-get install -y nodejs \
  && curl -L https://www.npmjs.com/install.sh | sh

WORKDIR /hydra-validator

ADD tsconfig.json .
ADD run.ts .
ADD package*.json ./

RUN npm ci
RUN npm run build
RUN mkdir tests

ENTRYPOINT node run.js

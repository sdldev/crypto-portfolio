FROM node:lts AS build
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn
COPY next.config.js ./next.config.js

CMD ["yarn", "start"]
FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install && yarn build

COPY next.config.js ./next.config.js

CMD ["yarn", "start"]
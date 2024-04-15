FROM node:lts AS build
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn
COPY next.config.js ./next.config.js

CMD ["yarn", "start"]

FROM nginx:alpine AS runtime
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8081
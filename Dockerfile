FROM node:12.18.0-alpine

ARG ENV
ENV NODE_ENV="${ENV}"
RUN mkdir -p /app
WORKDIR /app
ADD . /app/
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*
RUN rm package-lock.json || true
RUN npm install
RUN npm run build

ENV HOST 0.0.0.0
EXPOSE 5600

CMD [ "npm","run", "start"]
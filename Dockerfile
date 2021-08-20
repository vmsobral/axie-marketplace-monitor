FROM node:14.17.1-alpine@sha256:cc1a31b2f4a3b8e9cdc6f8dc0c39a3b946d7aa5d10a53439d960d4352b2acfc0

RUN npm i -g npm@7.18.1

WORKDIR /app

COPY ["package.json", "package-lock.json", "/app/"]

RUN apk update && apk add --no-cache dumb-init

COPY . /app

ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "src/index"]

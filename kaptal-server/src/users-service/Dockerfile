FROM node:alpine

ENV PORT=3000

EXPOSE ${PORT}
WORKDIR /app

COPY package.json /app
RUN npm install

COPY . /app
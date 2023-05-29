FROM node:alpine

ENV PORT=8070

EXPOSE ${PORT}
WORKDIR /app

COPY package.json /app
RUN npm install

COPY . /app
FROM node:18

ENV PORT=3234
EXPOSE ${PORT}
WORKDIR /app

COPY package.json /app
RUN npm install

COPY . /app

CMD ["npm", "start"]

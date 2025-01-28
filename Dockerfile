FROM node:23.5 as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY .env ./.env

RUN node --max-old-space-size=8192 npm run build
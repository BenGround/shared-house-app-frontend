FROM node:23.5 as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY .env ./.env

RUN npm run build
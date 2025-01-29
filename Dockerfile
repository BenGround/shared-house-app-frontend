FROM node:23.5-alpine as build

WORKDIR /app

ENV NODE_OPTIONS=--max_old_space_size=2048
COPY package*.json ./

RUN npm install

COPY . .

COPY .env ./.env

RUN npm run build
FROM node

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

COPY . ./

RUN npm install

COPY node_modules ./
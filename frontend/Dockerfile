FROM node:19.5.0-alpine
RUN mkdir /frontend
WORKDIR /frontend
COPY package.json /frontend/package.json
RUN npm install
RUN npm install axios
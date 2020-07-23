FROM node:12
WORKDIR /app
RUN npm install -g nodemon
COPY package*.json ./
RUN npm install
COPY . ./app
EXPOSE 9090
CMD [ "node", "imageServer.js" ]
FROM node:14

WORKDIR /app

COPY package*.json ./

RUN apt-get update && apt-get install -y git

RUN npm install

COPY . .

EXPOSE 8080

CMD ["node", "app.js"]

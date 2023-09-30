FROM node:14

COPY package*.json  ./


RUN npm install

COPY . .

RUN ng build

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0"]
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm i -g @angular/cli

COPY . .

# RUN ng build --configuration production

EXPOSE 4200

CMD ["ng", "serve", "--configuration", "production", "--host", "0.0.0.0"]

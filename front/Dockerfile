FROM node:18

WORKDIR /app

COPY package.json ./

RUN npm cache clean --force
RUN rm -rf dist
RUN npm install
RUN npm i -g @angular/cli

COPY . .

RUN ng build 

EXPOSE 4200

CMD ["ng", "serve", "--configuration", "production", "--host", "0.0.0.0"]


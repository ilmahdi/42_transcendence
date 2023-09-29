FROM node:20-alpine3.16

WORKDIR /app

COPY package*.json  ./


RUN npm install
RUN npm i -g @nestjs/cli

COPY . . 

COPY ./tools/entry.sh /tmp/entry.sh

EXPOSE 3000

CMD ["sh", "/tmp/entry.sh"]
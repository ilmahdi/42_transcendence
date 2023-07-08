FROM node:20-alpine3.16

# RUN npm install -g npm

WORKDIR /app

# RUN npm i -g @nestjs/cli

ENTRYPOINT npm install --silent && npm run start:dev
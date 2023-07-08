FROM node:20-alpine3.16

# RUN npm install -g npm

WORKDIR /app

# RUN npm i -g @nestjs/cli

# EXPOSE 8080

ENTRYPOINT npm install --silent && npm run start:dev
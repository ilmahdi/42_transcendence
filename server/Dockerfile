FROM node:20-alpine

WORKDIR /app

COPY package*.json  ./

RUN npm install
RUN npm i -g @nestjs/cli

COPY . . 

RUN npx prisma generate
RUN npm run build 

EXPOSE 3000

CMD ["sh", "/app/tools/entry.sh"]

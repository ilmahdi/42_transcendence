.PHONY: all start-services stop-services

all: start-services pause stop-services

start-services:
	docker-compose up -d
	if [ ! -d "server/node_modules" ]; then cd server && npm i ; fi
	if [ ! -d "front/node_modules" ]; then cd front && npm i ; fi
	cd front && ng serve --host 0.0.0.0 &
	cd server && npx prisma db push --accept-data-loss 
	cd server && npx prisma studio --browser Google\ Chrome &
	cd server && npm run start:dev & 

pause:
	@read -rsn1

stop-services:
	pkill -f "npm run start:dev"
	pkill -f "ng serve"
	pkill -f "node"
	docker-compose down

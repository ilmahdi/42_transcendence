#!/bin/sh


npx prisma db push --accept-data-loss 

exec npm run start:prod
#!/bin/sh


ng build --configuration production

exec ng serve --configuration production --host 0.0.0.0
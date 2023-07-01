FROM node:19-alpine

WORKDIR /usr/src/app

COPY ./package.json  ./

RUN npm install
COPY ./ ./
RUN npm run build

CMD ["sh", "-c", "npm run migration:generate -- migrations/migration-update -o;npm run migration:run;npm run start:prod"]
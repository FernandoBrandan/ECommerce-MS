FROM node:18-alpine

WORKDIR /app

COPY ./package.json ./
COPY ./tsconfig.json ./
RUN npm install

COPY ./src ./src
RUN npm run build

COPY ./src/views ./dist/views
COPY ./src/public ./dist/public

CMD ["npm", "run", "start"]

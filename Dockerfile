FROM node:16.15-alpine3.14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm install -g typescript
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]

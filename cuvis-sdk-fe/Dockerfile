FROM node:16-alpine

# Set Environment Variables
ENV TZ=Europe/Berlin
#ENV NODE_OPTIONS=--openssl-legacy-provider

WORKDIR /app

COPY . .

RUN npm install --legacy-peer-deps

RUN npm install -g serve

RUN npm run build

RUN rm -rf node_modules

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]

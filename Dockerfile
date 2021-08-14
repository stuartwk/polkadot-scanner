FROM node:14 as base

WORKDIR /app

# Add package file
COPY ["./server/package*.json", "./server/tsconfig.json", "./server/"]
COPY ./server/.env ./server/dist/.env
COPY ./server/src ./server/src

WORKDIR /app/server


# Install deps
RUN npm i

# Build Server
RUN npm run build

WORKDIR /app

COPY ./client ./client

# Build Client
WORKDIR /app/client
RUN yarn install
RUN yarn run build

WORKDIR /app/server/dist

# Expose port 3000
EXPOSE 8080
CMD ["index.js"]
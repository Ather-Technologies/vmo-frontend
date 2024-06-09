// Everybody loves alpine
FROM alpine:3.19

# Install dependencies
RUN apk add --no-cache nodejs npm

# Setup Node.js application
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .

ENTRYPOINT ["npm", "run", "prod"]
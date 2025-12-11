FROM node:20

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

EXPOSE 3001

CMD ["node", "server.mjs"]

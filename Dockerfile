FROM node:20-alpine

WORKDIR /app

# Backend
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --prod
COPY backend ./backend

# Frontend
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci && npm run build
COPY frontend/build ./frontend/build

EXPOSE 3001
CMD ["node", "backend/server.mjs"]

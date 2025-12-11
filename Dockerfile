FROM node:20-alpine

WORKDIR /app

# Backend
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --prod
COPY backend ./backend

# Frontend
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci --prod && npm run build
COPY frontend ./frontend

EXPOSE 3001
CMD ["node", "backend/server.mjs"]

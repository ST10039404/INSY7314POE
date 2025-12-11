# Frontend build
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# Copy all frontend files
COPY frontend/package*.json ./
COPY frontend/ ./

# Install all deps (including devDependencies for CRA) and build
RUN npm ci && npm run build

# Backend + final image
FROM node:20-alpine
WORKDIR /app

# Backend
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --prod
COPY backend ./backend

# Copy frontend build from builder stage
COPY --from=frontend-builder /app/frontend/build ./frontend/build

# Expose port
EXPOSE 3001

# Start backend server
CMD ["npm", "run", "start", "--prefix", "backend"]


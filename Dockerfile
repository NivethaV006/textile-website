# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY public/ public/
COPY src/ src/
RUN npm run build

# Stage 2: Build Backend & Production Image
FROM node:18-alpine
WORKDIR /app

# Copy backend dependencies and code
COPY backend/package*.json ./
RUN npm install --production
COPY backend/server.js ./
COPY backend/ .

# Copy built frontend from Stage 1 to the backend's public folder
COPY --from=frontend-builder /app/build ./public

# Set Node environment to production
ENV NODE_ENV=production

# Expose backend port
EXPOSE 3001

# Start the optimized container
CMD ["node", "server.js"]

# Backend Dockerfile for GuardianEye
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application files
COPY *.js ./

# Expose backend port
EXPOSE 3001

# Start the server
CMD ["node", "server.js"]

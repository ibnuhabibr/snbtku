# Build stage
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Install dependencies for build
RUN apk add --no-cache python3 make g++ git

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --quiet

# Copy project files
COPY . .

# Build the project
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Create app directories
RUN mkdir -p /app/uploads /app/logs

# Copy built files from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package*.json ./

# Create and set permissions for uploads directory
RUN chown -R node:node /app

# Switch to non-root user
USER node

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -q --spider http://localhost:$PORT/health || exit 1

# Expose port
EXPOSE 3001

# Start the server
CMD ["node", "dist/index.js"]

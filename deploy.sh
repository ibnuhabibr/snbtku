#!/bin/bash
# Deployment script for SNBTKU platform
# This script automates the deployment process for the entire stack

set -e

# Print with colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=======================================${NC}"
echo -e "${BLUE}   SNBTKU Platform Deployment Script   ${NC}"
echo -e "${BLUE}=======================================${NC}"

# Ensure we're in the project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Check if .env exists, create if it doesn't
if [ ! -f .env ]; then
  echo -e "${YELLOW}Creating .env file from template...${NC}"
  cp .env.example .env
  echo -e "${GREEN}Created .env file. Please edit it with your configuration.${NC}"
  echo -e "${RED}Exiting. Please configure your .env file and run the script again.${NC}"
  exit 1
fi

# Load environment variables
source .env

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
  echo -e "${RED}Docker is not installed. Please install Docker and try again.${NC}"
  exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
  echo -e "${RED}Docker Compose is not installed. Please install Docker Compose and try again.${NC}"
  exit 1
fi

# Check environment type
ENV=${1:-production}
if [ "$ENV" == "production" ]; then
  COMPOSE_FILE="docker-compose.production.yml"
  echo -e "${GREEN}Deploying PRODUCTION environment${NC}"
elif [ "$ENV" == "staging" ]; then
  COMPOSE_FILE="docker-compose.staging.yml"
  echo -e "${YELLOW}Deploying STAGING environment${NC}"
else
  COMPOSE_FILE="docker-compose.yml"
  echo -e "${BLUE}Deploying DEVELOPMENT environment${NC}"
fi

# Create required directories
echo -e "${BLUE}Creating required directories...${NC}"
mkdir -p ./nginx/ssl
mkdir -p ./nginx/logs
mkdir -p ./backend/uploads
mkdir -p ./backend/logs

# Ensure correct permissions
echo -e "${BLUE}Setting permissions...${NC}"
chmod -R 755 ./nginx
chmod -R 755 ./backend/uploads
chmod -R 755 ./backend/logs

# Check if SSL certificates exist for production
if [ "$ENV" == "production" ] && [ ! -f ./nginx/ssl/fullchain.pem ]; then
  echo -e "${YELLOW}SSL certificates not found. Using self-signed certificates for now.${NC}"
  echo -e "${YELLOW}Please replace with proper certificates for production.${NC}"
  
  # Generate self-signed certificates for development/testing
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout ./nginx/ssl/privkey.pem \
    -out ./nginx/ssl/fullchain.pem \
    -subj "/C=ID/ST=Jakarta/L=Jakarta/O=SNBTKU/CN=snbtku.com"
fi

# Build and start containers
echo -e "${BLUE}Building and starting containers...${NC}"
docker-compose -f $COMPOSE_FILE build
docker-compose -f $COMPOSE_FILE up -d

# Wait for services to be ready
echo -e "${BLUE}Waiting for services to be ready...${NC}"
sleep 10

# Run database migrations for backend
echo -e "${BLUE}Running database migrations...${NC}"
docker-compose -f $COMPOSE_FILE exec backend npm run db:migrate

# Check if services are running
echo -e "${BLUE}Checking service status...${NC}"
docker-compose -f $COMPOSE_FILE ps

# Print success message
echo -e "${GREEN}=======================================${NC}"
echo -e "${GREEN}   SNBTKU Platform Deployed Successfully!   ${NC}"
echo -e "${GREEN}=======================================${NC}"

if [ "$ENV" == "production" ]; then
  echo -e "${GREEN}Frontend: https://snbtku.com${NC}"
  echo -e "${GREEN}Backend API: https://snbtku.com/api${NC}"
  echo -e "${GREEN}API Documentation: https://snbtku.com/api/docs${NC}"
else
  echo -e "${GREEN}Frontend: http://localhost:8080${NC}"
  echo -e "${GREEN}Backend API: http://localhost:3001/api${NC}"
  echo -e "${GREEN}API Documentation: http://localhost:3001/docs${NC}"
  echo -e "${GREEN}PgAdmin: http://localhost:5050${NC}"
fi

echo -e "${BLUE}To view logs, run: docker-compose -f $COMPOSE_FILE logs -f${NC}"
echo -e "${BLUE}To stop services, run: docker-compose -f $COMPOSE_FILE down${NC}"

#!/bin/bash

# PulseFit Gym - Setup Script
# This script automates the setup process

set -e

echo "🏋️ PulseFit Gym - Automated Setup"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if PostgreSQL is installed
echo -e "${BLUE}Checking PostgreSQL installation...${NC}"
if ! command -v psql &> /dev/null; then
    echo -e "${RED}PostgreSQL is not installed. Please install it first:${NC}"
    echo "macOS: brew install postgresql@14"
    echo "Linux: sudo apt install postgresql-14"
    exit 1
fi
echo -e "${GREEN}✓ PostgreSQL found${NC}"
echo ""

# Check if Node.js is installed
echo -e "${BLUE}Checking Node.js installation...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js 18+${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node --version) found${NC}"
echo ""

# Database setup
echo -e "${BLUE}Setting up database...${NC}"
read -p "PostgreSQL username (default: postgres): " DB_USER
DB_USER=${DB_USER:-postgres}

read -sp "PostgreSQL password: " DB_PASS
echo ""

# Create database
echo "Creating database..."
PGPASSWORD=$DB_PASS psql -U $DB_USER -c "CREATE DATABASE gym_management;" 2>/dev/null || echo "Database might already exist"

# Run schema
echo "Running database schema..."
PGPASSWORD=$DB_PASS psql -U $DB_USER -d gym_management -f backend/schema.sql
echo -e "${GREEN}✓ Database setup complete${NC}"
echo ""

# Backend setup
echo -e "${BLUE}Setting up backend...${NC}"
cd backend

# Update .env file
cat > .env << EOF
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gym_management
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASS
EOF

echo "Installing backend dependencies..."
npm install

echo -e "${GREEN}✓ Backend setup complete${NC}"
echo ""

# Frontend setup
echo -e "${BLUE}Setting up frontend...${NC}"
cd ../frontend

echo "Installing frontend dependencies..."
npm install

echo -e "${GREEN}✓ Frontend setup complete${NC}"
echo ""

# Summary
echo -e "${GREEN}=================================="
echo "✓ Setup Complete!"
echo "==================================${NC}"
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 (Backend):"
echo -e "  ${BLUE}cd backend && npm run dev${NC}"
echo ""
echo "Terminal 2 (Frontend):"
echo -e "  ${BLUE}cd frontend && npm run dev${NC}"
echo ""
echo "Then open: http://localhost:3000"
echo ""
echo "API will be at: http://localhost:5000"
echo ""
echo "Happy coding! 🚀"

# Popcorn Palace Movie Ticket Booking System - Instructions

## Overview
This document provides instructions on how to set up, build, run, and test the Popcorn Palace Movie Ticket Booking System, a RESTful API built with NestJS and TypeScript.

## Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- Docker and Docker Compose (for running PostgreSQL)
- Git

## Setup

### 1. Clone the Repository
```bash
git clone https://github.com/lordasd/popcorn-palace-api.git
cd popcorn-palace-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
The application uses environment variables for configuration. Create a .env file in the project root with the following content:

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=popcorn-palace
DB_PASSWORD=popcorn-palace
DB_DATABASE=popcorn-palace
NODE_ENV=development
```

### 4. Database Setup
The project uses PostgreSQL as the database. You can run it using Docker with the provided compose.yml file:

```bash
# Start the PostgreSQL container
docker-compose up -d
```

The PostgreSQL container will run with the following configuration:
- User: popcorn-palace
- Password: popcorn-palace
- Database: popcorn-palace
- Port: 5432 (mapped to host port 5432)


## Building the Application

To build the application:

```bash
npm run build
```

This will compile the TypeScript code into JavaScript in the `dist` directory.

## Running the Application
Start the PostgreSQL container if it's not already running
```bash
docker-compose up -d
```

### Development Mode
```bash
npm run start:dev
```

This starts the application in development mode with hot-reloading enabled.

### Production Mode
```bash
npm run start:prod
```

This starts the application in production mode using the compiled JavaScript code.

## Testing
Start the PostgreSQL container if it's not already running
```bash
docker-compose up -d
```

### Running Unit Tests
```bash
npm run test
```

This will run all unit tests and show the test coverage.

### Running End-to-End Tests
```bash
npm run test:e2e
```

This will run the end-to-end tests that test the API endpoints.

### Test Coverage
```bash
npm run test:cov
```

This will generate a test coverage report in the `coverage` directory.

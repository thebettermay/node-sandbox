Sure! Here’s the complete README.md file written in one markdown block:

````markdown
# Node Sandbox Application

This project is a Node.js application that demonstrates the use of TypeScript, PostgreSQL, Redis, and worker threads for asynchronous processing of CPU-intensive tasks. It includes routes for both synchronous and asynchronous processing of data retrieved from a PostgreSQL database.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Routes](#routes)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Synchronous Processing**: An endpoint (`/sync`) that pulls data from the database and performs CPU-intensive calculations (factorials) synchronously.
- **Asynchronous Processing**: An endpoint (`/async`) that utilizes Node.js worker threads to handle calculations asynchronously.
- **Database Interaction**: Connects to a PostgreSQL database to retrieve and store task data.
- **Caching**: Utilizes Redis for potential caching strategies.

## Technologies Used

- Node.js
- TypeScript
- PostgreSQL
- Redis
- Docker
- Webpack

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/node-sandbox-app.git
   cd node-sandbox-app
   ```
````

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up your environment variables in a `.env` file:
   ```env
   DATABASE_URL=postgres://user:password@db:5432/mydatabase
   REDIS_URL=redis://redis:6379
   WORKER_COUNT=4
   ```

## Usage

### Running with Docker

1. Build and run the Docker containers:

   ```bash
   docker-compose up --build
   ```

2. Access the application at `http://localhost:3000`.

### Running Locally (without Docker)

1. Build the TypeScript files:

   ```bash
   npm run build
   ```

2. Start the application:
   ```bash
   npm start
   ```

## Routes

- **GET /sync**: Synchronously processes tasks and returns the results in HTML format.
- **GET /async**: Asynchronously processes tasks using worker threads and returns the results.

## Database Setup

Ensure that you have PostgreSQL running and create a database with the necessary schema. The application includes logic to create a `tasks` table and seed it with sample data upon startup.

### Running Database Migrations

To manually create the database and tables, connect to your PostgreSQL instance using a client like `psql`, pgAdmin, or DBeaver, and run the SQL commands to create the `tasks` table if it doesn't exist.

## Running the Application

To run the application in Docker, use:

```bash
docker-compose up --build
```

To run it locally:

1. Build the TypeScript code:
   ```bash
   npm run build
   ```
2. Start the server:
   ```bash
   npm start
   ```

## Testing

Use Apache Benchmark (ab) or similar tools to test the performance of the endpoints. For example, you can run:

```bash
ab -n 1000 -c 10 http://localhost:3000/sync
```

This will send 1000 requests with a concurrency level of 10 to the `/sync` endpoint.

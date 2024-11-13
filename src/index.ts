import { createSchema } from "./database";
import express, { NextFunction, Response, Request } from "express";
import { Client } from "pg";
import { createClient } from "redis";
import compression from "compression";
import syncRoute from "./routes/sync";
import asyncRoute from "./routes/async";

const app = express();
app.use(compression());
const port = 3000;

const dbClient = new Client({
  connectionString: process.env.DATABASE_URL,
});

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

dbClient
  .connect()
  .then(async () => {
    console.log("Connected to database");
    await createSchema();
  })
  .catch((err) => {
    console.error(`Error connecting to database, ${err.stack}`);
  });

redisClient
  .connect()
  .then(() => {
    console.log("Connected to Redis");
  })
  .catch(() => {
    console.log("Error connecting to Redis");
  });

// Middleware to attach dbClient and redisClient to req
app.use((req: Request, res: Response, next: NextFunction) => {
  req.dbClient = dbClient;
  req.redisClient = redisClient;
  next();
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`Global Error: ${err.message}`);
  res.status(500).send("Internal Server Error");
});

app.use(syncRoute);
app.use(asyncRoute);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Extend the Request interface to include dbClient and redisClient
declare global {
  namespace Express {
    interface Request {
      dbClient: Client;
      redisClient: ReturnType<typeof createClient>;
    }
  }
}

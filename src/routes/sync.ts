import { Router, Request, Response, NextFunction } from "express";

const router = Router();

const factorial = (n: number): number => {
  return n <= 1 ? 1 : n * factorial(n - 1);
};

// Synchronous Route
router.get("/sync", async (req: Request, res: Response) => {
  console.time("syncProcessing");
  const startTime = Date.now();

  try {
    console.log("Starting database query...");
    const result = await req.dbClient.query("SELECT id FROM tasks LIMIT 1000");
    console.log("Database query completed.");
    const tasks = result.rows;

    const results = tasks.map((task) => ({
      id: task.id,
      factorial: factorial(task.id),
    }));
    console.log({ results });

    console.timeEnd("syncProcessing");
    const duration = Date.now() - startTime;

    const htmlResponse = `
            <html>
            <head>
                <title>Sync Processing Results</title>
            </head>
            <body>
                <h1>Sync Processing Results</h1>
                <p>Time taken: ${duration} ms</p>
                <h2>Tasks:</h2>
                <ul>
                    ${results
                      .map(
                        (task) =>
                          `<li>Task ID: ${task.id}, Factorial: ${task.factorial}</li>`
                      )
                      .join("")}
                </ul>
            </body>
            </html>
        `;

    res.send(htmlResponse);
  } catch (err) {
    console.error("Error processing sync request", err);
    res.status(500).send("Internal Server Error");
  }
});

export default router;

import { Request, Response, Router } from "express";
import { Worker } from "worker_threads";
import { expensiveTask } from "./sync";

const router = Router();

function processTasksInBatch(tasks: { id: number; number: number }[]) {
  const worker = new Worker("./dist/workers/factorial.mjs", {
    workerData: tasks,
  });
  return worker;
}

router.get("/async", async (req: Request, res: Response) => {
  console.time("asyncProcessing");
  const startTime = Date.now();

  try {
    const result = await req.dbClient.query("SELECT id FROM tasks LIMIT 1000");
    const tasks = result.rows.map((task) => ({ id: task.id, number: task.id }));

    // Start the HTML response with CSS for Grid layout
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.write(`
      <html>
      <head>
        <title>Async Processing Results</title>
        <style>
          .container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            max-width: 800px;
            margin: auto;
          }
          .result-box, .expensive-task-box {
            border: 1px solid #ccc;
            padding: 15px;
            border-radius: 8px;
          }
          .expensive-task-box {
            grid-column: 1 / span 2;
            background-color: #f9f9f9;
          }
          h2 {
            margin-top: 0;
            font-size: 1.25em;
          }
          .task-id {
            font-weight: bold;
            color: #333;
          }
          .task-result {
            margin: 5px 0;
            color: #555;
          }
        </style>
      </head>
      <body>
        <h1>Async Processing Results</h1>
        <div class="container">
          <!-- Placeholder for Expensive Task Result -->
          <div class="expensive-task-box">
            <h2>Expensive Task Result</h2>
            <p class="task-result" id="expensive-task-result">Loading...</p>
          </div>
    `);

    // Run the expensive task and send its result to the specific grid cell
    const expensiveTaskPromise = expensiveTask("Long Task").then(
      (expensiveTaskResult) => {
        res.write(`
        <script>
          document.getElementById("expensive-task-result").innerText = "${expensiveTaskResult}";
        </script>
      `);
        res.flush();
      }
    );

    // Process tasks in the worker
    const worker = processTasksInBatch(tasks);
    worker.on("message", (results: { id: number; result: number }[]) => {
      const duration = Date.now() - startTime;
      res.write(`
      <div class="result-box">
        <h2>Processing Duration: ${duration}ms</h2>
      </div>
      `);
      results.forEach(({ id, result }) => {
        res.write(`
        <div class="result-box">
        <h2>Task ID: ${id}</h2>
        <p class="task-result">Factorial Result: ${result}</p>
        </div>
      `);
      });
      res.flush();
    });

    worker.on("error", (err) => {
      console.error("Error processing async request", err);
      res.write(
        `<div class="result-box"><p>Error processing tasks: ${err.message}</p></div>`
      );
      res.end();
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        console.error(`Worker stopped with exit code ${code}`);
        res.write(
          `<div class="result-box"><p>Worker exited unexpectedly with code ${code}</p></div>`
        );
        res.end();
      }
    });

    // Wait for both tasks to complete before ending the response
    await Promise.all([
      expensiveTaskPromise,
      new Promise<void>((resolve) => worker.on("exit", resolve)),
    ]);

    // Close the container div and HTML response
    res.write(`
        </div>
      </body>
      </html>
    `);
    res.end();
    console.timeEnd("asyncProcessing");
  } catch (err) {
    console.error("Error processing async request", err);
    res.status(500).send("Internal Server Error");
  }
});

export default router;

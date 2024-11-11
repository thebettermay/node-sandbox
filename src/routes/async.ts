import { Request, Response, Router } from "express";
import { Worker } from "worker_threads";

const router = Router();

const runWorker = async (id: number) => {
  return new Promise((resolve, reject) => {
    const workerPath = new URL("../workers/factorial.ts", import.meta.url);
    const worker = new Worker(workerPath, {
      workerData: id,
    });

    worker.on("message", (res) => {
      resolve(res);
    });
    worker.on("error", (err) => {
      reject(err);
    });
    worker.on("exit", (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with code: ${code}`));
      }
    });
  });
};

router.get("/async", async (req: Request, res: Response) => {
  const workerCount = parseInt(process.env.WORKER_COUNT || "4", 10);

  console.time("syncProcessing");
  const startTime = Date.now();

  try {
    const result = await req.dbClient.query("SELECT id FROM tasks LIMIT 1000");
    const workers: Array<Promise<unknown>> = [];

    for (let i = 0; i < workerCount; i++) {
      workers.push(runWorker(i));
    }

    const idArray = result.rows.map((task) => task.id);
    let remaining = idArray.length;
    let nextWorker: number = 0;

    const results = await Promise.all(
      idArray.map(async (id) => {
        const worker = workers[nextWorker];
        nextWorker = (nextWorker + 1) % workerCount;
        return runWorker(id);
      })
    );

    console.timeEnd("syncProcessing");
    const duration = Date.now() - startTime;

    // const htmlResponse = `
    //         <html>
    //         <head>
    //             <title>Sync Processing Results</title>
    //         </head>
    //         <body>
    //             <h1>Sync Processing Results</h1>
    //             <p>Time taken: ${duration} ms</p>
    //             <h2>Tasks:</h2>
    //             <ul>
    //                 ${results
    //                   .map(
    //                     (task) =>
    //                       `<li>Task ID: ${task.id}, Factorial: ${task.factorial}</li>`
    //                   )
    //                   .join("")}
    //             </ul>
    //         </body>
    //         </html>
    //     `;

    res.send({ duration, results });
  } catch (err) {
    console.error("Error processing sync request", err);
    res.status(500).send("Internal Server Error");
  }
});

export default router;

import { parentPort, workerData } from "worker_threads";

const factorial = (n: number): number => {
  console.log(`Calculating factorial for ${n}`);
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  console.log(`Factorial of ${n} is ${result}`);
  return result;
};

// `workerData` now contains an array of task IDs and numbers
const tasks = workerData as { id: number; number: number }[];
console.log(`Received tasks: ${JSON.stringify(tasks)}`);

console.time("Worker execution time");
const results = tasks.map(({ id, number }) => {
  const result = factorial(number);
  console.log(`Task ID: ${id}, Number: ${number}, Result: ${result}`);
  return { id, result };
});
console.timeEnd("Worker execution time");

parentPort?.postMessage(results);
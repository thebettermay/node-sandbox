import { parentPort, workerData } from "worker_threads";

const factorial = (n: number): number => {
  return n <= 1 ? 1 : n * factorial(n - 1);
};
const result = factorial(workerData);
parentPort?.postMessage(result);

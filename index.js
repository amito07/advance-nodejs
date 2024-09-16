import express from "express";
import { Worker } from "worker_threads";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/non-blocking", (req, res) => {
  res.send("Non blocking request");
});

// unoptimized thread implementation
app.get("/blocking", async (req, res) => {
  console.time("blockingAPI");
  const worker = new Worker("./worker.js");

  worker.on("message", (sum) => {
    console.timeEnd("blockingAPI");
    res.send(`result is ${sum}`);
  });

  worker.on("error", (error) => {
    console.timeEnd("blockingAPI");
    res.send(`result is ${error}`);
  });
});

// optimized thread implementation

// create a function first

const THREAD_COUNT = 4;
const createWorkes = () => {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./four-worker.js", {
      workerData: {
        thread_count: THREAD_COUNT,
      },
    });

    worker.on("message", (data) => {
      resolve(data);
    });

    worker.on("error", (err) => {
      reject(err);
    });
  });
};

app.get("/optimized-blocking", async (req, res) => {
    console.time("optimizedBlockingAPI");
    const workerPromises = [];

    for (let i = 0; i < THREAD_COUNT; i++){
        workerPromises.push(createWorkes())
    }

    const thread_results = await Promise.all(workerPromises);

    const total = thread_results[0] + thread_results[1] + thread_results[2] + thread_results[3]
    
    console.log(thread_results[0])
    console.log(thread_results[1])
    console.log(thread_results[2])
    console.log(thread_results[3])

    console.timeEnd("optimizedBlockingAPI");
    res.status(200).send(`result is ${total}`)
})

app.listen(3000, () => {
  console.log("Server is running on localhost");
});

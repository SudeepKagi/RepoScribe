const { Worker } = require("bullmq");
const connection = require("../config/redis");

const worker = new Worker(
  "readme-generation",
  async (job) => {
    console.log("⚙️ Worker processing repo:", job.data.fullName);

    // later we add AI generation here
  },
  { connection },
);

worker.on("completed", () => {
  console.log("✅ Job completed");
});

worker.on("failed", (job, err) => {
  console.log("❌ Job failed:", err.message);
});

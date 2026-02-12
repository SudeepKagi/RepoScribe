const { Worker } = require("bullmq");
const connection = require("../config/redis");
const { generateReadme } = require("../services/aiService");

const worker = new Worker(
  "readme-generation",
  async (job) => {
    console.log("⚙️ Worker processing repo:", job.data.fullName);

    const readme = await generateReadme(job.data.fullName);

    console.log("✅ README generated");
    console.log(readme);
  },
  { connection },
);

worker.on("completed", () => {
  console.log("✅ Job completed");
});

worker.on("failed", (job, err) => {
  console.log("❌ Job failed:", err.message);
});

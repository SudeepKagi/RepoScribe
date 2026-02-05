require("dotenv").config();
const { Worker } = require("bullmq");
const IORedis = require("ioredis");
const fs = require("fs");
const path = require("path");
const Groq = require("groq-sdk");
const ignore = require("ignore");

// 1. Redis Connection
const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
});

// 2. Initialize AI
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

console.log("Worker is running and waiting for jobs...");

// 3. The Job Processor
const worker = new Worker("readme-queue", async (job) => {
  console.log(`Processing job for repo: ${job.data.repoName}`);
  
  const context = getRepoContext(process.cwd());
  
  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: "You are a tech writer. Generate a README.md." },
      { role: "user", content: `Code:\n${context}` }
    ],
    model: "llama-3.3-70b-versatile",
  });

  const readme = completion.choices[0]?.message?.content || "";
  
  const fileName = `README_${job.data.repoName}_generated.md`;
  fs.writeFileSync(fileName, readme);
  
  console.log(`Job Completed! File created: ${fileName}`);
}, { connection });

function getRepoContext(dir, fileList = []) {
  const ig = ignore().add(["node_modules", ".git", ".env", "dist", "package-lock.json", "*.png"]);
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const relativePath = path.relative(process.cwd(), filePath);
    if (ig.ignores(relativePath)) return;
    if (fs.statSync(filePath).isDirectory()) {
      getRepoContext(filePath, fileList);
    } else {
      try { fileList.push(fs.readFileSync(filePath, "utf-8")); } catch (e) {}
    }
  });
  return fileList.join("\n");
}
require("dotenv").config();
const { Worker } = require("bullmq");
const IORedis = require("ioredis");
const { Octokit } = require("@octokit/rest");
const Groq = require("groq-sdk");
const fs = require("fs");
const path = require("path");
const ignore = require("ignore");

//Redis Connection
const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
});

//Initialize Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

console.log("Worker is running and waiting for jobs...");

const worker = new Worker("readme-queue", async (job) => {
  const { repoName, userName, accessToken } = job.data;
  console.log(` Processing job for: ${userName}/${repoName}`);

  try {
    const octokit = new Octokit({ auth: accessToken });
    const context = getRepoContext(process.cwd()); 
    //Generate README with AI
    console.log("Asking AI to write documentation...");
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are an expert developer. Write a professional README.md in Markdown." },
        { role: "user", content: `Code Context:\n${context}` }
      ],
      model: "llama-3.3-70b-versatile",
    });

    const newReadmeContent = completion.choices[0]?.message?.content;
    const base64Content = Buffer.from(newReadmeContent).toString('base64');

    // Commit to GitHub!
    console.log("Pushing to GitHub...");
    
    let sha;
    try {
      const { data } = await octokit.repos.getContent({
        owner: userName,
        repo: repoName,
        path: "README.md",
      });
      sha = data.sha;
    } catch (err) {
    }

    await octokit.repos.createOrUpdateFileContents({
      owner: userName,
      repo: repoName,
      path: "README.md",
      message: "docs: auto-generated README by RepoScribe",
      content: base64Content,
      sha: sha,
    });

    console.log(`SUCCESS: README updated for ${userName}/${repoName}`);

  } catch (err) {
    console.error("Job Failed:", err.message);
  }

}, { connection });

// Helper to read local files
function getRepoContext(dir, fileList = []) {
  const ig = ignore().add(["node_modules", ".git", ".env", "dist", "package-lock.json", "*.png", ".DS_Store"]);
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
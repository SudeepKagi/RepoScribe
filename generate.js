require("dotenv").config();
const fs = require("fs");
const path = require("path");
const Groq = require("groq-sdk");
const ignore = require("ignore");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const ig = ignore().add([
  "node_modules", ".git", ".env", "dist", "build", "coverage",
  "package-lock.json", "yarn.lock",
  "*.png", "*.jpg", "*.svg", "*.ico",
  "README.md"
]);

function getRepoContext(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    const relativePath = path.relative(process.cwd(), filePath);

    if (ig.ignores(relativePath)) return;

    if (stat.isDirectory()) {
      getRepoContext(filePath, fileList);
    } else {
      try {
        const content = fs.readFileSync(filePath, "utf-8");
        fileList.push(`--- FILE: ${relativePath} ---\n${content}\n`);
      } catch (err) {
        // Skip binary files silently
      }
    }
  });

  return fileList.join("\n");
}

async function generateReadme() {
  console.log("Scanning codebase...");
  const context = getRepoContext(process.cwd());

  if (!context) {
    console.error("No files found to analyze.");
    return;
  }

  console.log(`Payload size: ~${Math.round(context.length / 4)} tokens`);
  console.log("Generating README.md...");

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a senior developer. Generate a professional README.md for this project. Include: Title, Badges, Description, Features, and Installation."
        },
        {
          role: "user",
          content: `Project Code:\n${context}`
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
    });

    const readmeContent = completion.choices[0]?.message?.content || "";

    fs.writeFileSync("README.md", readmeContent);
    console.log("README.md generated successfully!");

  } catch (error) {
    console.error("Error:", error.message);
  }
}

generateReadme();
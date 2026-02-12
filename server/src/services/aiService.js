const axios = require("axios");

const generateReadme = async (repoFullName) => {
  console.log("🤖 Generating README for", repoFullName);

  // TEMP FAKE RESPONSE
  // Later you replace with real repo analysis
  return `
# ${repoFullName}

This project is automatically documented by RepoScribe.

## Features
- AI generated documentation
- Always in sync with code

`;
};

module.exports = { generateReadme };

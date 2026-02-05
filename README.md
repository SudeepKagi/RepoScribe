# Reposcribe

[![npm](https://img.shields.io/npm/v/reposcribe)](https://www.npmjs.com/package/reposcribe)
[![License](https://img.shields.io/npm/l/reposcribe)](https://github.com/SudeepKagi/reposcribe/blob/main/LICENSE)
[![Code Size](https://img.shields.io/github/languages/code-size/SudeepKagi/reposcribe)](https://github.com/SudeepKagi/RepoScribe.git)

## Description

Reposcribe is a Node.js project that utilizes the Groq SDK to generate a professional README.md file for a given project. The project scans the codebase, ignoring certain files and directories, and uses the Groq chat completions API to create a high-quality README.md file.

## Features

- Scans the codebase to gather context for the README.md file
- Ignores certain files and directories, such as node_modules and binary files
- Uses the Groq chat completions API to generate a professional README.md file
- Includes the following sections in the README.md file:
  - Title
  - Badges
  - Description
  - Features
  - Installation

## Installation

To install Reposcribe, follow these steps:

1. Clone the repository: `git clone https://github.com/SudeepKagi/RepoScribe.git`
2. Install the dependencies: `npm install`
3. Create a .env file with your Groq API key: `GROQ_API_KEY=your-api-key`
4. Run the generateReadme script: `node generate.js`
5. The README.md file will be generated in the root of the project directory.

# README.md
================

## Introduction
This is a React + Vite project that utilizes the Groq SDK to generate a professional README.md file for a given project. The project scans the codebase, ignoring certain files and directories, and uses the Groq chat completions API to create a high-quality README.md file.

## Features

* Scans the codebase to gather context for the README.md file
* Ignores certain files and directories, such as node_modules and binary files
* Uses the Groq chat completions API to generate a professional README.md file
* Includes the following sections in the README.md file:
  + Title
  + Badges
  + Description
  + Features
  + Installation

## Installation

1. Clone the repository: `git clone https://github.com/SudeepKagi/RepoScribe.git`
2. Install the dependencies: `npm install`
3. Create a .env file with your Groq API key: `GROQ_API_KEY=your-api-key`
4. Run the generateReadme script: `node generate.js`
5. The README.md file will be generated in the root of the project directory.

## Usage

1. Start the server: `npm run dev`
2. Open the browser and navigate to `http://localhost:5173`
3. Click on the "Connect with GitHub" button to authenticate with GitHub
4. Once authenticated, click on the "Activate Scribe" button to generate the README.md file

## Configuration

The project uses the following configuration files:

* `.env`: stores the Groq API key and other environment variables
* `vite.config.js`: configures the Vite development server
* `generate.js`: configures the code scanning and README.md generation process

## Dependencies

The project uses the following dependencies:

* `axios`: for making HTTP requests to the Groq API
* `bullmq`: for job queueing and processing
* `cors`: for enabling cross-origin resource sharing
* `dotenv`: for loading environment variables from the `.env` file
* `express`: for creating the server
* `groq-sdk`: for interacting with the Groq API
* `ignore`: for ignoring certain files and directories during code scanning
* `ioredis`: for connecting to the Redis database
* `mongoose`: for interacting with the MongoDB database
* `passport`: for authenticating with GitHub
* `react`: for building the user interface

## Contributing

To contribute to this project, please fork the repository and submit a pull request with your changes. Make sure to include a detailed description of your changes and any relevant tests or documentation.

## License

This project is licensed under the ISC license. See the LICENSE file for more information.
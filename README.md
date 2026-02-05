# Reposcribe

[![npm](https://img.shields.io/npm/v/reposcribe)](https://www.npmjs.com/package/reposcribe)
[![License](https://img.shields.io/npm/l/reposcribe)](https://github.com/SudeepKagi/reposcribe/blob/main/LICENSE)
[![Code Size](https://img.shields.io/github/languages/code-size/SudeepKagi/reposcribe)](https://github.com/SudeepKagi/RepoScribe.git)

## Table of Contents

1. [Description](#description)
2. [Features](#features)
3. [Installation](#installation)
4. [Usage](#usage)
5. [API Documentation](#api-documentation)
6. [Contributing](#contributing)
7. [License](#license)

## Description

Reposcribe is a Node.js project that utilizes the Groq SDK to generate a professional README.md file for a given project. The project scans the codebase, ignoring certain files and directories, and uses the Groq chat completions API to create a high-quality README.md file.

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

To install Reposcribe, follow these steps:

1. Clone the repository: `git clone https://github.com/SudeepKagi/RepoScribe.git`
2. Install the dependencies: `npm install`
3. Create a .env file with your Groq API key: `GROQ_API_KEY=your-api-key`
4. Run the generateReadme script: `node generate.js`
5. The README.md file will be generated in the root of the project directory.

## Usage

To use Reposcribe, simply run the `generateReadme` script. This will scan the codebase and generate a README.md file using the Groq chat completions API.

## API Documentation

The Reposcribe API is a simple REST API that allows you to generate a README.md file for a given project. The API has the following endpoints:

* `GET /api/user`: Returns the current user's information
* `GET /api/repos`: Returns a list of the user's repositories
* `POST /api/activate`: Triggers a manual generation job for a given repository

## Contributing

To contribute to Reposcribe, please fork the repository and submit a pull request. Make sure to include a detailed description of your changes and follow the standard GitHub guidelines.

## License

Reposcribe is licensed under the ISC license. See the LICENSE file for more information.

# Contributing to Reposcribe

Reposcribe is an open-source project and we welcome contributions from the community. Here are some ways to contribute:

* **Bug reports**: If you find a bug in the code, please submit a bug report with a detailed description of the issue.
* **Code contributions**: If you'd like to contribute code to the project, please fork the repository and submit a pull request.
* **Documentation**: If you'd like to contribute to the documentation, please submit a pull request with your changes.

# License

Reposcribe is licensed under the ISC license. See the LICENSE file for more information.

```javascript
/**
 * @fileoverview Generates a professional README.md file for a given project.
 * @author Sudeep Kagi
 * @license ISC
 */
```
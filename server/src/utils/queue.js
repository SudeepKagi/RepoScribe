const { Queue } = require("bullmq");
const connection = require("../config/redis");

const readmeQueue = new Queue("readme-generation", {
  connection,
});

module.exports = readmeQueue;

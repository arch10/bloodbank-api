const logger = require("./logger");
const { sendError } = require("./errors");

module.exports = {
    logger: logger,
    sendError: sendError
};

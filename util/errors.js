function sendError(status = 400, message = "Unknown error") {
    return {
        status,
        message
    };
}

module.exports = {
    sendError
};

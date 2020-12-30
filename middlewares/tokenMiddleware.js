const admin = require("firebase-admin");
const { logger, sendError } = require("../util");

async function verifyAuthToken(req, res, next) {
    const authToken = req.headers["authorization"];
    if (!authToken) {
        logger.debug("No auth token found");
        res.status(401).json(sendError(401, "Please provide auth token"));
    } else {
        try {
            const idToken = authToken.split(" ")[1];
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            const uid = decodedToken.uid;
            req.uid = uid;
            next();
        } catch (error) {
            logger.debug(error.message);
            res.status(401).json(sendError(401, "Invalid token"));
        }
    }
}

module.exports = verifyAuthToken;

const router = require("express").Router();
const { sendError } = require("../util");
const logger = require("../util/logger");
const requestService = require("../services/requestService");

router.post("/", async (req, res) => {
    const uid = req.uid;
    const reqBody = req.body;
    try {
        const savedRequest = await requestService.saveRequest(uid, reqBody);
        res.status(200).json(savedRequest);
    } catch (error) {
        logger.debug(error.message);
        res.status(400).json(sendError(400, error.message));
    }
});

router.get("/me", async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const uid = req.uid;
        const requests = await requestService.getMyRequests(uid, page, limit);
        res.status(200).json(requests);
    } catch (error) {
        logger.debug(error.message);
        res.status(400).json(sendError(400, error.message));
    }
});

router.get("/", async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const uid = req.uid;
        const requests = await requestService.getRequestByUser(
            uid,
            page,
            limit
        );
        res.status(200).json(requests);
    } catch (error) {
        logger.debug(error.message);
        res.status(400).json(sendError(400, error.message));
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const reqId = req.params.id;
        await requestService.deleteRequest(reqId);
        res.status(200).json();
    } catch (error) {
        logger.debug(error.message);
        res.status(400).json(sendError(400, error.message));
    }
});

module.exports = router;

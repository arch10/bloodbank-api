const router = require("express").Router();
const { sendError } = require("../util");
const userService = require("../services/userService");
const logger = require("../util/logger");

router.get("/", async (req, res) => {
    const uid = req.uid;
    try {
        const user = await userService.getUser(uid);
        res.json(user);
    } catch (error) {
        logger.debug(error.message);
        res.status(400).json(sendError(400, error.message));
    }
});

router.post("/", async (req, res) => {
    const uid = req.uid;
    const reqBody = req.body;
    try {
        const savedUser = await userService.saveUser(uid, reqBody);
        res.json(savedUser);
    } catch (error) {
        logger.debug(error.message);
        res.status(400).json(sendError(400, error.message));
    }
});

module.exports = router;

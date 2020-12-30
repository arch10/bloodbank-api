const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const { logger } = require("./util");
const tokenValidator = require("./middlewares/tokenMiddleware");
require("dotenv").config();

//Get Routes
const { userRoute, errorRoute } = require("./routes");

//Connect to DB
mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});
const db = mongoose.connection;
db.on("error", (e) => logger.error(e.message));
db.once("open", () => logger.info("Connected to DB"));

//Setup firebase
const serviceAccount = require(process.env.FIREBASE_PATH);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

//Add Middleware
app.use(bodyParser.json());
app.use(tokenValidator);

//Add URL context
const contextPath = process.env.CONTEXT_PATH || "/v1";

//Add Routes
app.use(`${contextPath}/user`, userRoute);

const serverPort = process.env.PORT || 8080;
app.listen(serverPort, () => {
    logger.info(`Started server at port ${serverPort}`);
    logger.debug(`API context: ${contextPath}`);
});

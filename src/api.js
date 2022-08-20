const express = require("express");
const serverless = require("serverless-http");
const mongoose = require("mongoose");
const moment = require("moment");
const cors = require("cors");

mongoose.connect(process.env.SECRET_DB_CONNECTION_STRING);
const Schema = mongoose.Schema;

const userLogSchema = new Schema(
    {
        date: String,
        version: String,
    },
    { collection: "user_log" }
);

const userLog = mongoose.model("UserLog", userLogSchema);

const app = express();
app.use(cors());
const router = express.Router();

router.get("/", (req, res) => {
    userLog.find().then((data) => {
        res.json(data);
    });
});

router.post("/", (req, res) => {
    const tuple = {
        date: moment().local("de").format("YYYY-MM-DD HH:mm:ss"),
        version: req.body,
    };

    const data = new userLog(tuple);
    data.save();
    res.status(200).send("OK");
});

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);

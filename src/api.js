const express = require("express");
const serverless = require("serverless-http");
const mongoose = require("mongoose");

mongoose.connect(process.env.SECRET_DB_CONNECTION_STRING);
const Schema = mongoose.Schema;

const userLogSchema = new Schema(
    {
        date: String,
        version: Number,
    },
    { collection: "user_log" }
);

const userLog = mongoose.model("UserLog", userLogSchema);

const app = express();
const router = express.Router();

router.get("/", (req, res) => {
    userLog.find().then((data) => {
        res.json(data);
    });
});

router.get("/new", (req, res) => {
    const tuple = {
        date: Date.now().toString(),
        version: 0.0,
    };

    const data = new userLog(tuple);
    data.save();
    res.status(200).send("OK");
});

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);

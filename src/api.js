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
        app: String,
        version: String,
    },
    { collection: "user_log" }
);

const userLog = mongoose.model("UserLog", userLogSchema);

const app = express();
app.use(cors());
app.use(express.json());
const router = express.Router();

router.get("/", (req, res) => {
    try {
        userLog.find().then((data) => {
            res.json(data);
        });
    } catch (error) {
        console.log(error);
    }
});

router.post("/", (req, res) => {
    try {
        const { app, version } = req.body;
        if (app && version) {
            const tuple = {
                date: moment().local("de").format("YYYY-MM-DD HH:mm:ss"),
                app: app,
                version: version,
            };

            const data = new userLog(tuple);
            data.save();
            res.status(200).send("OK");
        } else {
            res.status(400).send("FAILURE");
        }
    } catch (error) {
        console.log(error);
    }
});

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);

const express = require("express");
const serverless = require("serverless-http");

const app = express();
const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        host: process.env.SECRET_DB_HOST,
        user: process.env.SECRET_DB_USER,
        pw: process.env.SECRET_DB_PW,
    });
});

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);

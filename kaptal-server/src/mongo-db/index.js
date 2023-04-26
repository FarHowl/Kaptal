const express = require("express");
const mongoose = require("mongoose");
const redis = require("redis");

const app = express();

app.listen(3006, () => {
    console.log("Mongo-cache is alive!");
});

// const redisClient = redis.createCLient({
//     host: "redis",
//     port: 6379,
// });

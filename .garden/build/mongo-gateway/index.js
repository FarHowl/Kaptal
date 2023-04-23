const express = require("express");
const mongoose = require("mongoose");
const redis = require("redis");

const app = express();

// mongoose.connect("mongodb://localhost:27017");

// mongoose.connection.on("error", (error) => {
//     console.log(error);
// });

// mongoose.connection.once("connected", () => {
//     console.log("Database Connected");
// });

app.listen(3006, () => {
    console.log("Mongo-gateway is alive!");
});

// const redisClient = redis.createCLient({
//     host: "redis",
//     port: 6379,
// });

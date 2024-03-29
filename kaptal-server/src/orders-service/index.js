const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const routes = require("./src/API");
const app = express();

mongoose.set("strictQuery", false);
mongoose.connect(`mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME + ":" + process.env.MONGO_INITDB_ROOT_PASSWORD}@orders-mongodb:27017`);

mongoose.connection.on("error", (error) => {
    console.log(error);
});

mongoose.connection.once("connected", () => {
    console.log("Database Connected");
});

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes);

app.listen(3000, () => {
    console.log("Orders alive");
});
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const routes = require("./src/API");
const app = express();

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://users-mongodb:27017/UsersDB");

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
    console.log("Users alive");
});
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const routes = require("./src/API");
const app = express();

// mongoose.set('strictQuery', false);
// mongoose.connect("mongodb+srv://FarHowl:3498569@kaptalcluster.fewuptw.mongodb.net/test");

// mongoose.connection.on("error", (error) => {
//     console.log(error);
// });

// mongoose.connection.once("connected", () => {
//     console.log("Database Connected");
// });

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

app.listen(3003, () => {
    console.log("Books alive");
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});
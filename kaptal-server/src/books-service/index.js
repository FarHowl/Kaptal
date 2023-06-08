const mongoose = require("mongoose");
const express = require("express");
const os = require("os");
const formData = require("express-form-data");
const cors = require("cors");

const routes = require("./src/API");
const app = express();

mongoose.set("strictQuery", false);
mongoose.connect(`mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME + ":" + process.env.MONGO_INITDB_ROOT_PASSWORD}@books-mongodb:27017`);

mongoose.connection.on("error", (error) => {
    console.log(error);
});

mongoose.connection.once("connected", () => {
    console.log("Database Connected");
});

const options = {
    uploadDir: os.tmpdir(),
    autoClean: true,
};

app.use(formData.parse(options));
app.use(formData.format());
app.use(formData.stream());
app.use(formData.union());

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
    console.log("Books alive");
});

const express = require("express");
const cors = require("cors");
const formData = require("express-form-data");
const os = require("os");
const app = express();

const routes = require("./src/API/adminAPI.js");

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

app.listen(3000, async () => {
    console.log("API-Gateway alive");
});

// const server = require("http").createServer(app);
// const io = require("socket.io")(server, {
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST"],
//     },
// });

// io.on("connection", (socket) => {
//     console.log(socket.id);
// });

// server.listen(3010, () => {
//     console.log("I am alive!");
// });

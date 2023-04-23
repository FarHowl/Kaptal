const express = require("express");
const vault = require("node-vault")();
// const redis = require("redis");
// const 

const app = express();

app.listen(3005, () => {
    console.log("HashiCorp Vault is alive!");
});

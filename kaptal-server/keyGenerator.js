const fs = require('fs');
const NodeRSA = require('node-rsa');

const key = new NodeRSA({b: 2048});

const privateKey = key.exportKey('pkcs1-private-pem');
const publicKey = key.exportKey('pkcs1-public-pem');

fs.writeFileSync('.env', `PRIVATE_KEY=${privateKey}\nPUBLIC_KEY=${publicKey}`);
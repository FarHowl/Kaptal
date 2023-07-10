const jwt = require("jsonwebtoken");

const verifyJWT = (req) => {
    const currentToken = req.headers.authorization.split(" ")[1];
    const frontendToken = jwt.decode(currentToken).frontendToken;

    jwt.verify(frontendToken, process.env.FRONTEND_GATEWAY_KEY);
    jwt.verify(currentToken, process.env.GATEWAY_ORDERS_KEY); 

    return jwt.decode(frontendToken);
};

module.exports = verifyJWT;

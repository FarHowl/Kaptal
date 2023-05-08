const jwt = require("jsonwebtoken");

const verifyJWT = async (req) => {
    const currentToken = req.headers.authorization.split(" ")[1];
    const parentToken = jwt.decode(token);

    jwt.verify(parentToken, process.env.FRONTEND_GATEWAY_KEY);
    jwt.verify(currentToken, process.env.GATEWAY_USERS_KEY);
};

module.exports = verifyJWT;

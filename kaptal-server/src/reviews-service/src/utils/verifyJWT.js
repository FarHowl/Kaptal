const jwt = require("jsonwebtoken");

const verifyJWT = (req) => {
    const currentToken = req.headers.authorization.split(" ")[1];
    const parentToken = jwt.decode(currentToken)?.parentToken;

    if (parentToken) {
        jwt.verify(parentToken, process.env.FRONTEND_GATEWAY_KEY);
        jwt.verify(currentToken, process.env.GATEWAY_REVIEWS_KEY);
    } else {
        jwt.verify(currentToken, process.env.GATEWAY_REVIEWS_KEY);
    }
};

module.exports = verifyJWT;

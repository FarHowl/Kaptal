const jwt = require("jsonwebtoken");

const verifyJWT = (req, hasToBeAuthorized) => {
    const currentToken = req.headers.authorization.split(" ")[1];
    const parentToken = jwt.decode(currentToken)?.parentToken;

    if (hasToBeAuthorized) {
        jwt.verify(parentToken, process.env.FRONTEND_GATEWAY_KEY);
        jwt.verify(currentToken, process.env.GATEWAY_BOOKS_KEY);
    } else {
        jwt.verify(currentToken, process.env.GATEWAY_BOOKS_KEY);
    }
};

module.exports = verifyJWT;
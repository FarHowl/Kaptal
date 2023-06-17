const jwt = require("jsonwebtoken");

const verifyJWT = (req, hasToBeAuthorized) => {
    const currentToken = req.headers.authorization.split(" ")[1];
    const frontendToken = jwt.decode(currentToken)?.frontendToken;

    if (hasToBeAuthorized) {
        jwt.verify(frontendToken, process.env.FRONTEND_GATEWAY_KEY);
        jwt.verify(currentToken, process.env.GATEWAY_USERS_KEY);
    } else {
        jwt.verify(currentToken, process.env.GATEWAY_USERS_KEY);
    }

    return jwt.decode(frontendToken);
};

module.exports = verifyJWT;

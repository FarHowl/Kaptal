const jwt = require("jsonwebtoken");

/**
 *
 * @param {object} res Response object
 * @param {object} req Request object
 * @param {array} allowedRoles User roles that is allowed to make the request
 */
const verifyJWT = async (req, allowedRoles) => {
    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.jwtKey);

    if (!allowedRoles.includes(decodedToken.role)) throw new Error("Access denied");
};

module.exports = verifyJWT;

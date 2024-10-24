const TokenBlacklist = require("../model/TokenBlacklist");

const checkTokenBlacklist = async (req, res, next) => {
    const token =
        req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) return next();

    const blacklistedToken = await TokenBlacklist.findOne({ token });

    if (blacklistedToken) {
        return res.status(401).json({ message: "Token is invalid" });
    }

    next();
};

module.exports = checkTokenBlacklist;

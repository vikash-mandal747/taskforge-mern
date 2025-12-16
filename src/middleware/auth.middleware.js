require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT_SECRETKEY = process.env.JWT_SECRET;

const authMiddleware = (allowedRoles = []) => {
    return (req, res, next) => {
        try {
            const authHeader = req.headers?.authorization;

            // Check token presence
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({ msg: "Access token missing" });
            }

            const token = authHeader.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(token, JWT_SECRETKEY);

            // Role-based authorization
            if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
                return res.status(403).json({ msg: "Forbidden: insufficient role" });
            }

            // Attach user info to request
            req.userId = decoded.userId;
            req.role = decoded.role;


            next();
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ msg: "Access token expired" });
            }

            return res.status(401).json({ msg: "Invalid token" });
        }
    };
};

module.exports = authMiddleware;

import jwt from "jsonwebtoken";

// Auth middleware to protect routes
// - Reads JWT token from Authorization header
// - Verifies token
// - Attaches userId to req
// - Blocks unauthorized access with 401
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // From our login payload: { user: { id: user._id } }
        if (decoded && decoded.user && decoded.user.id) {
            req.userId = decoded.user.id;
            req.user = decoded.user;
        }

        next();
    } catch (err) {
        return res.status(401).json({ message: "Token is not valid" });
    }
};

export default authMiddleware;


import jwt from "jsonwebtoken"

export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];

        if(!token) {
            return res.status(401).json({message:"access denied. No token provided."})

        }
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.userId = decoded.userId

        next();
    } catch (error) {
       return res.status(401).json({
        error: "invalid or expired token"
       })
    }
}
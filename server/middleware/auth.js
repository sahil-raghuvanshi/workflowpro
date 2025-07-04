import jwt from 'jsonwebtoken';
import User from '../model/usermodel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'sahil@1234';

export default async function authMiddleware(req, res, next) {
    // take the bearer token from authentication header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({
            success: false,
            message: "Not Authorized,token missing"
        })
    }
    const token = authHeader.split(' ')[1];

    //verify and attach user object

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(payload.id).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            })
        }

        req.user = user;
        next();

    } catch (error) {
        console.log("JWT verification failed", error);
        return res.status(401).json({
            success: false,
            message: "Token invalid or expired"
        })
    }
}
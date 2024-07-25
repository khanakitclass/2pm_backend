
//1. User Authenticate
//2. Role
const jwt = require("jsonwebtoken");
const Users = require("../model/users.model");

const auth = (roles=[]) => async (req, res, next) => {
    try {
        const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Token not available"
            })
        }

        try {
            const validateToken = await jwt.verify(token, "wfwfweiuhoqwih745cwruyvqieud");

            console.log(validateToken);

            const user = await Users.findById(validateToken._id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                })
            }

            console.log(user, roles);

            if (!roles.some((v) => v === user.role)) {
                return res.status(400).json({
                    success: false,
                    message: "You have not access."
                })
            }

            console.log("okkkk");

            req.user = user;

            next();
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "Invalid Token"
            })
        }
        
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error " + error.message
        })
    }
}

module.exports = auth;

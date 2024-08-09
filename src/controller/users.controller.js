const Users = require("../model/users.model");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const genAccRefToken = async (id) => {
    try {

        const user = await Users.findById(id);

        const accessToken = await jwt.sign(
            {
                _id: user._id,
                role: user.role,
                expiresIn: '1 hours'
            },
            process.env.ACCESS_TOKEN_SECERET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        );

        const refreshToken = await jwt.sign(
            {
                _id: id
            },
            "iuedhbdkjhewiuhdw54sfvequyg87",
            { expiresIn: '2 days' }
        );

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken }
    } catch (error) {
        console.log(error);
    }
}

const register = async (req, res) => {
    try {
        console.log(req.body);

        const { email, password } = req.body;

        const user = await Users.findOne({
            $or: [{ email }]
        });

        console.log(user);

        if (user) {
            return res.status(409).json({
                success: false,
                message: 'User already exist.'
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        if (!hashPassword) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error while hashing password.'
            });
        }

        const userData = await Users.create({ ...req.body, password: hashPassword });

        if (!userData) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error while creating user.'
            });
        }

        const userDataF = await Users.findById(userData._id).select("-password");

        res.status(201).json({
            success: true,
            message: "Registration completed.",
            data: userDataF
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error' + error.message
        });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findOne({
            $or: [{ email }]
        });


        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not exist."
            });
        }

        const validateUser = await bcrypt.compare(password, user.password);

        if (!validateUser) {
            return res.status(400).json({
                success: false,
                message: "Invalid credential."
            });
        }

        const { accessToken, refreshToken } = await genAccRefToken(user._id);

        const userDataF = await Users.findById(user._id).select("-password -refreshToken");

        const options = {
            httpOnly: true,
            secure: true
        }

        res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                success: true,
                message: "Login successfully.",
                data: { ...userDataF.toObject(), accessToken }
            })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error' + error.message
        });
    }
}


const generateNewTokens = async (req, res) => {
    
    try {
        console.log("generateNewTokensgenerateNewTokens",req.cookies.refreshToken);

        try {
            if (!req.cookies.refreshToken) {
                return res.status(400).json({
                    success: false,
                    message: "Refresh token not found."
                })
            }
            
            const validateToken = await jwt.verify(req.cookies.refreshToken, "iuedhbdkjhewiuhdw54sfvequyg87");

            console.log("validateTokenvalidateToken", validateToken)
            if (!validateToken) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid token"
                });
            }

            console.log(validateToken);

            const user = await Users.findById(validateToken._id);

            console.log(user);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            console.log(req.cookies.refreshToken, user.toObject().refreshToken);

            if (req.cookies.refreshToken != user.toObject().refreshToken) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid token"
                });
            }

            const { accessToken, refreshToken } = await genAccRefToken(user._id);

            const options = {
                httpOnly: true,
                secure: true
            }

            res.status(200)
                .cookie("accessToken", accessToken, options)
                .cookie("refreshToken", refreshToken, options)
                .json({
                    success: true,
                    message: "Login successfully.",
                    data: { accessToken }
                })
        } catch (error) {
            console.log("eeeeccc", error);

        }




    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error' + error.message
        });
    }
}

module.exports = {
    register,
    login,
    generateNewTokens
}
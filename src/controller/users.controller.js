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
            { expiresIn: 3600 }
        );

        const refreshToken = await jwt.sign(
            {
                _id: id
            },
            "iuedhbdkjhewiuhdw54sfvequyg87",
            { expiresIn: 360000 }
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

        // console.log(req.file);


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
            secure: true,
            maxAge: 1000 * 1000
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

const logout = async (req, res) => {
    console.log("logoutttttttttt", req.body);

    try {
        const u = await Users.findByIdAndUpdate(
            req.body._id,
            {
                $unset: {
                    refreshToken: 1 // this removes the field from document
                }
            },
            {
                new: true
            }
        );

        console.log(u);

    } catch (error) {
        console.log("errr logouttt", error);

    }

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({
            success: true,
            message: "User logged Out"
        })
}

const generateNewTokens = async (req, res) => {
    try {
        console.log("1 generateNewTokens", req.cookies.refreshToken);

        if (!req.cookies.refreshToken) {
            return res.status(400).json({
                success: false,
                message: "Refresh token not found"
            })
        }

        const validateToken = await jwt.verify(req.cookies.refreshToken, "iuedhbdkjhewiuhdw54sfvequyg87");

        if (!validateToken) {
            return res.status(400).json({
                success: false,
                message: "Invalid token"
            });
        }

        console.log("222222",validateToken);

        const user = await Users.findById(validateToken._id);

        console.log("33333333",user);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        console.log("4444444444",req.cookies.refreshToken, user.toObject().refreshToken);

        if (req.cookies.refreshToken != user.toObject().refreshToken) {
            return res.status(400).json({
                success: false,
                message: "Invalid token"
            });
        }

        const { accessToken, refreshToken } = await genAccRefToken(user._id);

        const options = {
            httpOnly: true,
            secure: true,
            maxAge: 1000*1000
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
        return res.status(500).json({
            success: false,
            message: 'Internal server error' + error.message
        });
    }
}

const checkAuth = async (req, res) => {
    try {
        const token = req.cookies.accessToken; // Get token from cookies

        console.log(token);
        

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No access token provided'
            });
        }

        // Verify the token
        jwt.verify(token, process.env.ACCESS_TOKEN_SECERET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid or expired token'
                });
            }

            // Token is valid
            res.status(200).json({
                success: true,
                data: decoded // Send user info if needed
            });
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error: ' + error.message
        });
    }
}

module.exports = {
    register,
    login,
    logout,
    generateNewTokens,
    checkAuth
}
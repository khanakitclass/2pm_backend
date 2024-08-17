const express = require("express");
const { usersController } = require("../../../controller");
const passport = require("passport");
const upload = require("../../../middleware/upload");
const { genAccRefToken } = require("../../../controller/users.controller");

const router = express.Router();

router.post(
    "/register",
    // upload.single("avtar"),
    usersController.register
);

router.post(
    "/logout",
    usersController.logout
);

router.post(
    "/login",
    usersController.login
);

router.post(
    "/generateNewTokens",
    usersController.generateNewTokens
);

router.get(
    "/checkAuth",
    usersController.checkAuth
);

router.get('/googleLogin',
    passport.authenticate('google', {
        scope:
            ['email', 'profile']
    }
    ));

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login'
    }),
    async function (req, res) {
        // Successful authentication, redirect home.
        console.log("qqqqqqqqqqqqqqqqqqqqqqq");
        console.log(req.isAuthenticated());
        console.log(req.session);
        console.log("ooooooooooo", req.user);
        console.log("req.session.passport.user._id",req.session.passport.user._id);


        if (req.isAuthenticated()) {
            const { accessToken, refreshToken } = await genAccRefToken(req.session.passport.user._id);

            console.log("new token", accessToken, refreshToken);
            

            const optionsAcc = {
                httpOnly: true,
                secure: true,
                maxAge: 60 * 60 * 1000
            }

            const optionsRef = {
                httpOnly: true,
                secure: true,
                maxAge: 60 * 60 * 24 * 10 * 1000
            }

            res.status(200)
                .cookie("accessToken", accessToken, optionsAcc)
                .cookie("refreshToken", refreshToken, optionsRef)
                .redirect("https://2pm-frontend.vercel.app/")
        }
    }
);

module.exports = router
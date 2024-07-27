const express = require("express");
const { usersController } = require("../../../controller");
const passport = require("passport");

const router = express.Router();

router.post(
    "/register",
    usersController.register
);

router.post(
    "/login",
    usersController.login
);

router.post(
    "/generateNewTokens",
    usersController.generateNewTokens
);

router.post(
    "/logout",
    usersController.logout
);

router.get(
    '/googleLogin',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        console.log("Success google login");
        // Successful authentication, redirect home.
        res.send("<h1>OKK</h1>");
    });

module.exports = router
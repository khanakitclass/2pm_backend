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
    function (req, res) {
        // Successful authentication, redirect home.
        console.log("qqqqqqqqqqqqqqqqqqqqqqq");
        console.log(req.isAuthenticated());
        console.log(req.session);
        console.log("ooooooooooo");


        res.send("<h1>OK</h1>");
    }
);

module.exports = router
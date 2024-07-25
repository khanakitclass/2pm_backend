const express = require("express");
const { usersController } = require("../../../controller");

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

module.exports = router
const express = require("express");
const upload = require("../../../middleware/upload");
const { salespeopleController } = require("../../../controller");

const router = express.Router();


router.get(
    "/get-salespeople",
    salespeopleController.listSalesPeople
);

router.post(
    "/add-salespeople",
    salespeopleController.addSalesPeople
);

module.exports = router
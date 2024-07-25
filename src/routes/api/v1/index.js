const express = require("express");

const router = express.Router();

const categoriesRoutes = require("./categories.routes");

const salesPeopleRoutes = require("./salespeople.routes");
const usersRoutes = require("./users.route");


//localhost:3000/api/v1/categories
router.use("/categories", categoriesRoutes);
router.use("/salespeople", salesPeopleRoutes);
router.use("/users", usersRoutes);


module.exports = router
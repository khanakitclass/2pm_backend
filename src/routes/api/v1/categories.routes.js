const express = require("express");
const { categoryController } = require("../../../controller");
const upload = require("../../../middleware/upload");
const auth = require("../../../middleware/auth");
const validation = require("../../../middleware/validation");
const { categoryValidation } = require("../../../validation");

const router = express.Router();


router.get(
    "/get-category",
    validation(categoryValidation.getCategory),
    categoryController.getCategory
);

//localhost:3000/api/v1/categories/list-categories
router.get(
    "/list-categories",
    auth(["admin", "user"]),
    categoryController.listCategories
);

router.post(
    "/add-category",
    upload.single("product_img"),
    validation(categoryValidation.createCategory),
    categoryController.addCategory
)

router.put(
    "/update-category/:category_id",
    upload.single("product_img"),
    validation(categoryValidation.updateCategory),
    categoryController.updateCategory
);

router.delete(
    "/delete-category/:category_id",
    validation(categoryValidation.deleteCategory),
    categoryController.deleteCategory
)

module.exports = router
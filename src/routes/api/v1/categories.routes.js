const express = require("express");
const { categoryController } = require("../../../controller");
const upload = require("../../../middleware/upload");
const auth = require("../../../middleware/auth");

const router = express.Router();


router.get(
    "/get-category/:category_id",
    categoryController.getCategory
);

//localhost:3000/api/v1/categories/list-categories
router.get(
    "/list-categories",
    auth(["admin", "employees"]),
    categoryController.listCategories
);

router.post(
    "/add-category",
    upload.single("cat_img"),
    categoryController.addCategory
)

router.put(
    "/update-category/:category_id",
    categoryController.updateCategory
);

router.delete(
    "/delete-category/:category_id",
    categoryController.deleteCategory
)

module.exports = router
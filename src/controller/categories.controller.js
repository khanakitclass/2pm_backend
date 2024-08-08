const Categories = require("../model/categories.model");
const { uploadFile } = require("../utils/cloudinary");

const listCategories = async (req, res) => {
    console.log("cateeee", req.query.page, req.query.pageSize);
    try {
        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize);

        if (page <= 0 || pageSize <= 0) {
            return res.status(400).json({
                success: false,
                message: "Page or page size must greater than zero."
            })
        }

        const categories = await Categories.find();

        if (!categories || categories.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Categories not found"
            })
        }

        let startIndex=0, endIndex=0, paginatedData=categories;

        if (page > 0 && pageSize > 0) {             //page=2 pageSize=3
            startIndex = (page-1)*pageSize;         //startIndex=(2-1)*3=3
            endIndex = startIndex + pageSize;       //endIndex = 3+3 = 6
            paginatedData = categories.slice(startIndex, endIndex)
        }

        res.status(200).json({
            success: true,
            totalData: categories.length,
            message: "Categories fetched successfully.",
            data: paginatedData
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error: " + error.message
        })
    }
}

const getCategory = async (req, res) => {
    try {
        console.log(req.params.category_id);

        const category = await Categories.findById(req.params.category_id);

        if (!category) {
            res.status(404).json({
                success: false,
                message: "Category not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Category fetched successfully.",
            data: category
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error: " + error.message
        })
    }
}

const addCategory = async (req, res) => {
    console.log("ggcccccccc", req.body);
    console.log("ffffffffffff",req.file);
    try {
        console.log(req.body);
        console.log(req.file);

        const fileRes = await uploadFile(req.file.path, "Category");
        console.log(fileRes);
        const category = await Categories.create({
            ...req.body,
            cat_img: {
                public_id: fileRes.public_id,
                url: fileRes.url
            }
        });

        if (!category) {
            res.status(400).json({
                success: false,
                message: "Category not created."
            });
        }

        res.status(201).json({
            success: true,
            message: "Category created successfully.",
            data: category
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error: " + error.message
        })
    }
}

const deleteCategory = async (req, res) => {
    try {
        const category = await Categories.findByIdAndDelete(req.params.category_id);
        
        if (!category) {
            res.status(404).json({
                success: false,
                message: "Category not found."
            })
        }

        res.status(200).json({
            success: true,
            message: "Category deleted successfully.",
            data: category
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error: " + error.message
        })
    }
}

const updateCategory = async (req, res) => {
    console.log("sdcsdc", req.params.category_id, req.body);

    try {
        const category = await Categories.findByIdAndUpdate(req.params.category_id, req.body, {new: true, runValidators: true});    

        if (!category) {
            res.status(400).json({
                success: false,
                message: "Category not update."
            })
        }

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error: " + error.message
        })
    }
}

module.exports = {
    listCategories,
    getCategory,
    addCategory,
    deleteCategory,
    updateCategory
}
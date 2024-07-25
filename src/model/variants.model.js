const mongoose = require("mongoose");

//sub schema
const attributesSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        },
        stock: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }
)

const variantsSchema = new mongoose.Schema(
    {
        product_id: {
            type: mongoose.Types.ObjectId,
            ref: 'Products',
            required: true
        },
        attributes: [attributesSchema]
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Variants = mongoose.model("Variants", variantsSchema);
module.exports = Variants;
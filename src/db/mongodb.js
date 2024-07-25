const mongoose = require('mongoose');

const connectDB = async() => {
    try {
        await mongoose.connect("mongodb+srv://ankitndphotos1:abcd123@cluster0.gp3mou1.mongodb.net/ecommerce")
            .then(() => console.log("MongoDB connection successfully."))
            .catch((error) => console.log("MongoDB Database connection error: " + error))
    } catch (error) {
        console.log("MongoDB Database connection error: " + error)
    }
}

module.exports = connectDB
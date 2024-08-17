const mongoose = require('mongoose');

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
            .then(() => console.log("MongoDB connection successfully."))
            .catch((error) => console.log("MongoDB Database connection error: " + error))
    } catch (error) {
        console.log("MongoDB Database connection error: " + error)
    }
}

module.exports = connectDB
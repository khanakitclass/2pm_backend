const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            lowercase: true
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            trim: true
        },
        role: {
            type: String,
            trim: true,
            required: true
        },
        googleId: {
            type: String,
        },
        is_active: {
            type: Boolean,
            default: true
        },
        avatar: {
            type: String,
        },
        refreshToken: {
            type: String,
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Users = mongoose.model("Users", usersSchema);
module.exports = Users;
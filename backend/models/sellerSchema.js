const mongoose = require("mongoose")

const sellerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String
    },
    role: {
        type: String,
        default: "Seller"
    },
    shopName: {
        type: String,
        unique: true,
        sparse: true
    }
});

module.exports = mongoose.model("seller", sellerSchema)
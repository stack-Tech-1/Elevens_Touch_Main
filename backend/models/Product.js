const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: String,
    price: Number,
    image: String,
    category: String,
    description: String,
    material: String,
    colors: [String],
    sizes: [String],
    units: Number,
    new: Boolean,
    newArrival: Boolean,
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
// This code defines a Mongoose schema for a Product model in a Node.js application.
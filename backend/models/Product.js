const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    price: String,
    category: String,
    company: String
});

// Create a compound index to prevent duplicates
productSchema.index({name: 1, price: 1, category: 1, company: 1}, {unique: true});

module.exports = mongoose.model('Products', productSchema);
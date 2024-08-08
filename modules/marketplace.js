const mongoose = require('mongoose');

const marketplaceSchema = new mongoose.Schema({
    sellerId: String,
    itemName: String,
    price: Number,
    id: String,
    itemEa: String,
    sellerName: String,
    amount: Number,
    itemId: Number,
    type: String
});

module.exports = mongoose.model('Marketplace', marketplaceSchema);
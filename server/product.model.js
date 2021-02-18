var mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    productId: Number,
    name: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    inCart: Number
})
var Product = mongoose.model('Product', ProductSchema)
module.exports = Product

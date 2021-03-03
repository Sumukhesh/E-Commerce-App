const mongoose = require("mongoose")
const {ObjectId} = mongoose.Schema


const ProductCartSchema = new mongoose.Schema({
    product: {
       type: ObjectId,
       ref: "product" ,
    },
    name: String,
    count: Number,
    price: Number,
})

const ProductCart = mongoose.model("ProductCart",ProductCartSchema )

var orderSchema = new mongoose.Schema({
    products: [ProductCartSchema],
    transaction_id: {},
    cash_on_delivery: {type: Boolean},
    amount: {type: Number},
    address: {type: String, maxlength: 60},
    status: {
        type: String,
        default: "Recieved",
        enum: ["Cancelled","Delivered","Shipped","Processing","Recieved"],
    },
    updated: Date,
    user: {
        type: ObjectId,
        ref: "User",
    }
},{timestamps: true})


const Order = mongoose.model("Order", orderSchema)

module.exports = {Order, ProductCart}



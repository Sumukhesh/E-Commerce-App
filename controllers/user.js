const User = require('../models/user');
const Order = require("../models/order");


exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if(err || !user){
             res.status(401).json({
                 error: "No user was found in DB"
             })
        }
        req.profile = user
        next()
    }) 
}

exports.userPurchaseList = (req,res) => {
    Order.find({user: req.profile._id})
    .populate("user","_id name") 
    // a detailed explanation of populate() is in this article https://medium.com/@nicknauert/mongooses-model-populate-b844ae6d1ee7
    .exec((err, order) => {
        if(err){
            return res.status(400).json({
                error: "NO order in account"
            })
        }
        return res.json(order)
    })

}

exports.pushOrderInPurchaseList = (req,res,next) => {
    let purchases = []
    req.body.order.products.forEach(product => {
        purchases.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transaction_id: req.body.order.transaction_id

        })
        
    });
    //store this in DB
    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$push: {purchases: purchases}},
        {new: true}, 
        (err, purchases) => {
            if(err){
                return res.status(400).json({
                    error: "UNable to save purchase list"
                })
            }
            next()
        }
    )
    
    
}

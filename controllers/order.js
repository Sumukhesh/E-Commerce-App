const {Order, ProductCart} = require("../models/order")

exports.getOrderById = (req,res,next,id) => {
    Order.findById(id)
    .populate("products.Product","name price")
    .exec((err, order)=> {
        if(err){
            console.log(err);
            return res.status(400).json({
                error: "No order in DB"
            })
        }
        req.order = order
        next()
    })
}

exports.createOrder = (req,res) => {
    req.body.order.user = req.profile
    const order = new Order(req.body.order)
    order.save((err,order) => {
        if(err){
            return res.status(400).json({
                error: "failed to save your order in DB "
            }) 
        }
        res.json(order)
    })
}

exports.getAllOrders = (req,res) => {
    Order.find({})
    .populate("user", "_id name")
    .exec((err,orders) => {
        if(err){
            return res.status(400).json({
                error: "Cant find orders in DB"
            })
        }
        res.json(orders)
    })
}

exports.getAvailableOrderStatuses = (req,res) => {
    res.json(Order.schema.path("status").enumValues)
}

exports.updateStatus = (req,res) => {
    //console.log(req.profile);
    Order.findByIdAndUpdate(
        {_id: req.order._id},
        {$set: {status: req.body.status}},
        (err,order) => {
            if(err){
                console.log(err);
                return res.status(400).json({
                    error: "Unable to update"
                })
            }
            if(order){
                Order.findById({_id: req.order._id}).exec((err, order) => {
                    if(err){
                        return err
                    }
                    res.json(order)
                })
            }
        }

    )
}
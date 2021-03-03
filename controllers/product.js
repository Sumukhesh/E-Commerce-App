//my code
const Product = require("../models/product")
const formidable = require("formidable")
const _ = require("lodash")
const fs = require("fs")

exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
    .populate("category")
    .exec((err, product) => {
        if(err){
            return res.status(400).json({
                error: "Cant find the product in the DB"
                
            })   
        }
        req.product = product
        next()
    })

}

exports.createProduct = (req,res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true //This will keep the file extensions(.jpeg, .png) as same 
    // when uploaded in dir

    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error: "Problem with Image"
            })
        }
        const {name,description,price,stock,category} = fields

        if(
            !name ||
            !description ||
            !price ||
            !category ||
            !stock
        ){
            //console.log(fields);
            return res.status(400).json({
                error: "Please enter all the fields "
            })
        }
        let product = new Product(fields)
        //handle file here
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "File size too big"
                })
            } 
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }     
      //save variable to db
      product.save((err, product) => {
        if(err){
             res.status(400).json({
                error: "Saving product into db failed"
            })
        }
        res.json(product)
    }) 
    })
}

exports.getProduct = (req, res) => {
    req.product.photo = undefined
    return res.json(req.product)
}

//Middleware
exports.photo = (req, res, next) =>{
    if(req.product.photo.data){
        res.set("Content-Type", req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next()
}

//delete controller
exports.deleteProduct = (req, res) => {

    let product = req.product 
    product.remove((err, deletedprod) => {
        if(err){
            return res.status(400).json({
                error: `Unable to remove the ${product.name}`
            })
        }
        res.json({
            message: "Deleteion successful",
            deletedprod
        })
    })
}

//update controller
exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true

    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error: "Problem with Image"
            })
        }
        let product = req.product 
        product = _.extend(product, fields) 

        //handle file here
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "File size too big"
                })

            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }
        
      //save to db
      product.save((err, product) => {
          if(err){
               res.status(400).json({
                  error: "updation of product is failed"
              })
              //console.log(err)
          }
          res.json(product)
      })  
    })
}

//product listing
exports.getAllProducts = (req,res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id"

    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products)=> {
        if(err){
            return res.status(400).json({
                error: "No products found"
            })
        }
        res.json(products)
    })
}

//updating inventory
exports.updateStock = (req, res, next) => {

    let myOperations = req.body.order.products.map(prod => {
        return {
            updateOne: {
                filter: {_id: prod._id},
                update: {$inc: {stock: -prod.count, sold: +prod.count}}
            }
        }
    })

    Product.bulkWrite(myOperations, {}, (err, products) => {
        if(err){
            return res.status(400).json({
                error: "Bulk operation failed"
            })
        }
        next()
    })

}

exports.getAllUniqueCategories = (req, res) => {
    Product.distinct("category", {}, (err, category) => {
        if(err){
            return res.status(400).json({
                error: "No category found"
            })
        }
        res.json(category)
    })
}
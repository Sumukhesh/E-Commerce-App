const express = require("express");
const router = express.Router();

const {getCategoryById} = require("../controllers/category");
const{
    getProductById,
    createProduct, 
    getProduct, 
    photo, 
    deleteProduct, 
    updateProduct,
    getAllProducts,
    getAllUniqueCategories
} = require("../controllers/product");
const {getUserById} = require("../controllers/user");
const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth");

//Params
router.param("categoryId",getCategoryById)
router.param("productId",getProductById)
router.param("userId",getUserById)

//Create product
router.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, createProduct)

//Get Product and product photo by id
router.get("/product/:productId", getProduct)
router.get("/product/photo/:productId", photo)

//Update Product
router.put("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, updateProduct)

//delete Product
router.delete("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, deleteProduct)

//listing all products 
router.get("/products", getAllProducts)

//listing all unique categories
router.get("/products/categories", getAllUniqueCategories)

module.exports = router
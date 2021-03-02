var express = require("express");
var router = express.Router();

const {getCategoryById, createCategory, getCategory, getAllCategories, updateCategory, removeCategory} = require("../controllers/category");
const {isAuthenticated, isAdmin, isSignedIn} = require("../controllers/auth");
const {getUserById} = require("../controllers/user");

//Params
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);


//creating a category
router.post("/create/category/:userId", isSignedIn, isAuthenticated, isAdmin, createCategory); 

//Reading or getting a category
router.get("/categories", getAllCategories)
router.get("/category/:categoryId", getCategory)

//Updating a category
router.put("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, updateCategory);

//Deleting a category
router.delete("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, removeCategory);

module.exports = router;

const express = require("express")
const router = express.Router()
const{isAuthenticated, isAdmin, isSignedIn} = require("../controllers/auth")
const {getUserById, pushOrderInPurchaseList} = require("../controllers/user")
const{getOrderById,createOrder,getAllOrders,updateStatus,getAvailableOrderStatuses} = require("../controllers/order");
const{updateStock} = require("../controllers/product")

//params
router.param("userId", getUserById)
router.param("orderId", getOrderById)

//creating a order
router.post(
    "/order/create/:userId", 
    isSignedIn, 
    isAuthenticated, 
    pushOrderInPurchaseList,
    updateStock, 
    createOrder
)
//Getting all user orders
router.get("/order/all/:userId", isSignedIn, isAuthenticated, isAdmin, getAllOrders)

//getting status of order
router.get("/order/status/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    getAvailableOrderStatuses
    )
//Updating order status   
router.put("/order/:orderId/status/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    updateStatus
)


module.exports = router
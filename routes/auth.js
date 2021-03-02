var express = require('express');
var router = express.Router()
const {check} = require('express-validator');

const {signout, signup, signin} = require("../controllers/auth.js")

router.get("/signout", signout)

router.post("/signup", [
    check("name","Name should be more than 3 letters").isLength({min:3}),
    check("email","Email is required").isEmail(),
    check("password","Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/,)

], signup); 

router.post("/signin", [
    check("email","Email is required").isEmail(),
    check("password","Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/,)
], signin); 

module.exports = router;
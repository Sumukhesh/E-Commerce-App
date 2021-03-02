const User = require("../models/user");
const {validationResult} = require("express-validator");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

exports.signup = (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: [errors.array()[0].msg]
        })
    }

    const user = new User(req.body);

    user.save((err, user) => {
        console.log(user);
        if(err || !user) {
            return res.status(400).json({
                error: "Not able to save user to DB"
            });
        }

        res.json({
            name: user.name,
            email: user.email,
            id: user._id
        })
    })
}

exports.signin = (req, res) => {
    const errors = validationResult(req);
    const {email, password} = req.body;
    if(!errors.isEmpty()){
        return res.status(422).json({
            error: [errors.array()[0].msg]
        })
    }

    User.findOne({ email }, (err,user) => {
        if(err || !user) {
            return res.status(400).json({
                error: "User doesnt exist in DB"
            })
        }

        if(!user.authenticate(password)){
            return res.status(401).json({
                error: "Email and password combination doesnt match",
            })
        }

        //creating token
        const token = jwt.sign({_id: user._id}, process.env.SECRET)
        //put token in the cookie
        res.cookie("token", token , {expire: new Date() + 9999})
        //send the response obj back
        const {_id, name, email, role} = user;
        return res.json({token, user:{_id, name, email, role}})

    })
}

exports.signout = (req, res) => {
    res.clearCookie("token");
    res.json({
        Message: "User signed out"
    })
}

//protected routes
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth",
    algorithms: ['sha1', 'RS256', 'HS256']
})

//custom middlewares
exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!checker){
        return res.status(403).json({
            error: "ACCESS DENIED",
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if(req.profile.role === 0) {
        return res.status(402).json({
            error: "You are not an Admin, ACCESS DENIED",
        });
    }
    next();
};
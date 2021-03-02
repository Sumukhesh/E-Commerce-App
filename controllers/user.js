const User = require('../models/user');

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
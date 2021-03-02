const mongoose = require('mongoose');
const crypto = require('crypto');
const uuid = require('uuid').v4;

var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    userinfo: {
        type: String,
        trim: true
    },
    encry_password: {
        type: String,
        required: true
    },
    salt: {
        type: String
    },
    role: {
        type: Number,
        default: 0
    },
    purchases: {
        type: Array,
        default: []
    }
},{timestamps: true}
);

//A  virtual to assign value to the encry_password and uuid to salt

userSchema.virtual("password")
.set(function(password) {
    this._password = password
    this.salt = uuid()
    this.encry_password = this.securePassword(password)
})
.get(function(){
    return this._password
})



//A method created to perform encryption on the plain password and
//to check authentication of the user   
userSchema.methods = {

authenticate: function(plainpassword) {
  return this.securePassword(plainpassword) === this.encry_password
},

securePassword: function(plainpassword) {
if (!plainpassword) return""
try{
    return crypto.createHmac('sha256', this.salt)
           .update(plainpassword)
           .digest("hex");
}catch(err){
    return ""
}

}
}            

module.exports = mongoose.model("User", userSchema);
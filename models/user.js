const mongoose = require('mongoose');
const crypto = require('crypto');
const passportlocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema;
const userSchema = new Schema({
    email:String,
    first_name:String,
    last_name:String,
    phone:String,
    address:String,
    delivery_address:String,
    billing_address:String,
    shipping_address:String,
    age:String,
    gender:String,
    pan:String,
    gst_number:String,
    profile:String,
    street:String,
    area:String,
    city:String,
    state:String,
    pincode:String,
    passwordResetToken:String,
    passwordResetExpires:Date,
    date:{
        type:Date,
        default:Date.now
    }

});

userSchema.methods.createPasswordResetToken=function(){
    const resetToken=crypto.randomBytes(32).toString('hex');
    this.passwordResetToken=crypto.createHash('sha256').update(resetToken).digest('hex');
    console.log({resetToken},this.passwordResetToken);
    this.passwordResetExpires=Date.now()+10*60*1000
    return resetToken;
}

userSchema.plugin(passportlocalMongoose);
module.exports = mongoose.model('User', userSchema)
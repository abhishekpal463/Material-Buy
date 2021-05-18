const mongoose = require('mongoose');
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
    date:{
        type:Date,
        default:Date.now
    }

});
userSchema.plugin(passportlocalMongoose);
module.exports = mongoose.model('User', userSchema)
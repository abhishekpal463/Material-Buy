const mongoose = require('mongoose');
const passportlocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema;
const subCategorySchema = new Schema({
    name:{
        type:String,
        required:true
    },
    subtitle:String,
    image:String, 
    date:{
        type:Date,
        default:Date.now()
    }
});

//subCategorySchema.plugin(passportlocalMongoose);
const SubCategory = mongoose.model('SubCategory', subCategorySchema);
module.exports = SubCategory;
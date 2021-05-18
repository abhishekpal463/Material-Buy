const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;
const adminSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username can't be blank"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password can't be blank"],
  },
});
adminSchema.statics.findAndValidate = async function (username, password) {
    const foundUser = await this.findOne({ username });
    const isvalid = await bcrypt.compare(password, foundUser.password);
    return isvalid ? foundUser : false;
}
module.exports = mongoose.model('Admin', adminSchema);

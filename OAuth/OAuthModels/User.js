let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let userModel = new Schema({
    username: {
        type: String,
        unique: true
    },
    password: String,
    __v: {type: Number, select: false}
});
module.exports = mongoose.model('User', userModel);

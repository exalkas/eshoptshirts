const mongoose = require('mongoose');

const sizeSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: 1,
        maxlength:100
    }
});

const Size = mongoose.model('size',sizeSchema);

module.exports = { Size }
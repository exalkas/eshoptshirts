const mongoose = require('mongoose');

const colorSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: 1,
        maxlength:100
    }
});

const Color = mongoose.model('color',colorSchema);

module.exports = { Color }
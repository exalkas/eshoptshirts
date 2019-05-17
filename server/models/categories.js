const mongoose = require('mongoose');

const categoriesSchema = mongoose.Schema({
    name:{
        required: true,
        type: String,
        unique: 1,
        maxlength:100
    },
    description: {
        type: String,
        maxlength: 255
    },
    category_id:{
        type: Number
    }
});

const Category = mongoose.model('categories',categoriesSchema);

module.exports = { Category }
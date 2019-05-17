const mongoose = require('mongoose');

const departmentSchema = mongoose.Schema({
    name:{
        required: true,
        type: String,
        unique: 1,
        maxlength: 100
    },
    description: {
        type: String,
        maxlength: 255
    },
    deparment_id: {
        type: Number
    }
});

const Department = mongoose.model('departments',departmentSchema);

module.exports = { Department }
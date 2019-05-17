const mongoose = require('mongoose');

const shippingSchema = mongoose.Schema({
    shipping_type:{
        // required: true,
        type: String,
        // unique: 1,
        maxlength:100
    },
    shipping_cost: {
        type: Number,
        maxlength: 255
    },
    shipping_region_id:{
        type: Number
    }
});

const Shipping = mongoose.model('shipping',shippingSchema);

module.exports = { Shipping }
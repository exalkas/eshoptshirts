const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = mongoose.Schema({

    userId:{
        type:Schema.Types.ObjectId
    },
    userData:{
            name:{type:String},
            lastname:{type:String},
            email:{type:String},
            phone:{type:String},
            address:{type:String}
        },
    products:[{
        product_Id:{type: Schema.Types.ObjectId},
        quantity:{type:Number},
        size:{type:String},
        color:{type:String}
    }],
    pOrder:{type:String},
    dateOfPurchase:{type:Date},
    paymentData:{},
    shipping:{type:String},
    totalPaid:{type:Number}
})

const Order = mongoose.model('Orders',orderSchema);

module.exports = { Order }
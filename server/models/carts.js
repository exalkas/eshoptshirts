const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
    products:[{
        product_Id:{type: Schema.Types.ObjectId},
        quantity:{type:Number},
        size:{type:String},
        color:{type:String}
    }]
},{timestamps:true});

// const userSchema = mongoose.Schema({
//     products:{
//         type:Array,
//         default:[]
//     }
// })

const Cart = mongoose.model('Carts',userSchema);

module.exports = { Cart }
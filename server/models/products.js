const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = mongoose.Schema({
    name:{
        required: true,
        type: String,
        unique: 1,
        maxlength:100
    },
    description:{
        required: true,
        type: String,
        maxlength:100000
    },
    category:{
        required:true,
        type: Schema.Types.ObjectId,
        ref: "categories"
    },
    department:{
        required:true,
        type: Schema.Types.ObjectId,
        ref: "departments"

    },
    price:{
        required: true,
        type: Number,
        default: 0.0
    },
    discounted_price:{
        required: true,
        type: Number,
        default: 0.0
    },
    publish:{
        required: true,
        type: Boolean
    },
    colors:[{
        required: true,
        type: String,
    }],
    size:[{
        required: true,
        type: String,
    }],
    images:{
        type: Array,
        default:[]
    },   
},{timestamps:true});

const Products = mongoose.model('Products',productSchema);
module.exports = { Products }
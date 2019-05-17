const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcrypt'); //encrypt strings like passwords
const jwt = require('jsonwebtoken');// to create jason web tokens
const crypto = require('crypto'); //for token generation
const moment = require("moment");
const SALT_I = 10;
require('dotenv').config();// needed for toker generation to salt the userid and hash it

const userSchema = mongoose.Schema({
    email:{
        type:String,
        required: true,
        trim: true,
        unique: 1
    },
    password:{
        type:String,
        required: true,
        minlength: 5
    },
    name:{
        type:String,
        required: true,
        maxlength:100
    },
    lastname:{
        type:String,
        required: true,
        maxlength:100
    },
    phone:{
        type:String,
        required: true,
        maxlength:25
    },
    address:{
        type:String,
        required: true,
        maxlength:255
    },
    role:{
        type:Number,
        default:0
    },
    cart_id:{
        type:{type: Schema.Types.ObjectId}
    },
    token:{
        type:String
    },
    resetToken:{ //token for reset
        type:String
    },
    resetTokenExp:{ //when token is expiring
        type:Number
    },
});

// .pre means before we do what is specified inside the parenthesis, which is "save" in this case
// passwords need to be hashed
userSchema.pre('save',function(next){//next is the CB
    var user = this;
    //console log next to see what is inside
    if(user.isModified('password')){//create a hash only when the field password is being modified
        bcrypt.genSalt(SALT_I,function(err,salt){
            if(err) return next(err); //if error pass it to the next (the CB function)
    
            bcrypt.hash(user.password,salt,function(err,hash){//hashes new pass
                if(err) return next(err);
                user.password = hash;
                next();
            });
        })
    } else{
        next()
    }
})

// Compare provided password with the stored one
// candidatepassword is the one the user entered
userSchema.methods.comparePassword = function(candidatePassword,cb){
    
    bcrypt.compare(candidatePassword,this.password,function(err,isMatch){
        if(err) return cb(err);
        cb(null,isMatch) // success, so err is null. is Match is what the bcrypt.compare returns
    })
}

// method to generate token
userSchema.methods.generateResetToken = function(cb){
    // console log this to see what's inside
    var user = this;

    crypto.randomBytes(20,function(err,buffer){ //create a string (a hash) 20 chars, named buffer
        var token = buffer.toString('hex');//convert string token to hex (tostring('hex') is from node)
        var today = moment().startOf('day').valueOf();//get the numbers only for today
        var tomorrow = moment(today).endOf('day').valueOf();//expires tomorrow - end of today. console log to check it

        user.resetToken = token; //build object
        user.resetTokenExp = tomorrow;
        user.save(function(err,user){ //run cb
            if(err) return cb(err);//if err return err from cb
            cb(null,user); //else run cb
        })
    })
}

//generate json web token
userSchema.methods.generateToken = function(cb){
    var user = this;
    // generate web token for specific user
    // takes user id plus the secret and creates a hash 
    var token = jwt.sign(user._id.toHexString(),process.env.SECRET)

    user.token = token;
    user.save(function(err,user){// store the token inside the document
        if(err) return cb(err);
        cb(null,user);// user object includes all the document
    })
}

/**
 * Search DB by token
 */
userSchema.statics.findByToken = function(token,cb){
    var user = this;

    //Verify token with JWT and grab userid
    // decode will contain the userid
    jwt.verify(token,process.env.SECRET,function(err,decode){
        user.findOne({"_id":decode,"token":token},function(err,user){
            if(err) return cb(err);
            cb(null,user);
        })
    })
}

const Customer = mongoose.model('Customer',userSchema);

module.exports = { Customer }
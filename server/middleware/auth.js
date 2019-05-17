const { Customer } = require('./../models/customers');

/**
 * Auth middleware to check if user is authenticated 
 * @param {*} req is the request object
 * @param {*} res is the response object
 * @param {*} next allows next CB function in the caller to be executed
 */
let auth = (req,res,next) => {
    
    let token = req.cookies.w_auth; //read the cookie

    //Is token ok?
    Customer.findByToken(token,(err,user)=>{
        if(err) {throw err; console.log("Server auth error: ",err);}
        if(!user) return res.json({ //User not found
            isAuth: false,
            error: true
        });

        //return what user was found along with token
        req.token = token;
        req.user = user;
        next();
    })

}


module.exports = { auth }
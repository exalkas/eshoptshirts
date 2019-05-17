const express = require('express');
//To handle HTTP POST request in Express.js version 4 and above, you need to install middleware module called body-parser.
//body-parser extracts the entire body portion of an incoming request stream and exposes it on req.body.
//The middleware was a part of Express.js earlier but now you have to install it separately
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); 

const formidable = require('express-formidable');//for files parser
const cloudinary = require('cloudinary'); //cloudinary connector

const app = express();

const mongoose = require('mongoose'); //obsolete

require('dotenv').config();//handles env

mongoose.Promise = global.Promise;//obsolete
mongoose.connect(process.env.MONGODB_URI , { useNewUrlParser: true }) //added useNewUrlParser to avoid deprecation warning

//to Fix some deprecation warnings
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

//app.use Mounts the specified middleware function or functions at the specified path: 
//the middleware function is executed when the base of the requested path matches path

//Use body-parser to Parse POST Requests
//use url encoded so the body gets encoded as a query string
//extended is true which means that we can post nested objects (uses querystrings which supports nested objects)
//In these kind of requests the data doesn’t appear in the URL, 
//it is hidden in the request body. This is a part of the HTML request, also called payload. 
//Since HTML is text based, even if you don’t see the data, it doesn’t mean that they are secret.
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());//middleware to parse json
app.use(cookieParser());//to have req.cookies...

app.use(express.static('client/build')) //It serves static files and is based on serve-static.where are the static files. where are the static files

//=================================
// Models
//=================================
const { Products } = require('./models/products');
const { Site } = require('./models/site');
const { Customer } = require('./models/customers');
const { Cart } = require('./models/carts');
const { Category } = require('./models/categories');
const { Department } = require('./models/departments');
const { Shipping } = require('./models/shippings');
const { Order } = require('./models/orders.js');
const { Size } = require('./models/size');
const { Color } = require('./models/colors');

// Middlewares
const { auth } = require('./middleware/auth');
const { admin } = require('./middleware/admin');
const multer = require('multer'); //for uploading files
app.use(express.static('client/build')) //It serves static files and is based on serve-static. where are the static files

// UTILS
const { sendEmail } = require('./utils/mail/index');

//setup cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// STORAGE MULTER CONFIG

// Needs to be configured at the beggining
let storage = multer.diskStorage({
    destination:(req,file,cb)=>{ //stores the files in a folder locally. build S3 may be?
        cb(null,'uploads/') //destination 
    },
    filename:(req,file,cb)=>{ //creates a filename for the file
        cb(null,`${Date.now()}_${file.originalname}`) //adds to original filename, date. check docs if needed
    },

    //If files need to be filtered. eg only jpg are accepted

    // fileFilter:(req,file,cb)=>{

    //     const ext = path.extname(file.originalname) //check extension
    //     if(ext !== '.jpg' && ext !== '.png'){
    //         return cb(res.status(400).end('only jpg, png is allowed'),false);
    //     }

    //     cb(null,true)
    // }
});

// DEFAULT 
//if route cannot be found - works only in production

if( process.env.NODE_ENV === 'production' ){ //if it's production environment
    const path = require('path');
    app.get('/*',(req,res)=>{
        res.sendfile(path.resolve(__dirname,'../client','build','index.html')) //send file index.html
    })
}


const port = process.env.PORT || 3002;
app.listen(port,()=>{
    console.log(`Our Server is Up and Running at ${port}`)
})

// //=================================
// //             ADMIN UPLOADS
// //=================================

// const upload = multer({
//     storage: multerS3({
//       s3: s3,
//       bucket: 'eshoptshirts',
//       acl: 'public-read',
//       metadata: function (req, file, cb) {
//         cb(null, {fieldName: file.fieldname});
//       },
//       key: function (req, file, cb) {
//         cb(null, Date.now().toString())
//       }
//     })
//   })
  
//   module.exports = upload;

// ///////////////////////////////////////

// const uploadLocal = multer({storage:storage }).single('file') //single for 1 file, check docs

// //api for user to upload files
// app.post('/api/users/uploadfile',auth,admin,(req,res)=>{
//     upload(req,res,(err)=>{ //this function is declared above
//         if(err){ //return error
//             return res.json({success:false,err})
//         }
//         return res.json({success:true})
//     })
// })

// //api for admin to return all files
// app.get('/api/users/admin_files',auth,admin,(req,res)=>{
//     const dir = path.resolve(".")+'/uploads/'; //returns app path and adds destination path. should be parameter
//     fs.readdir(dir,(err,items)=>{ //read dir from above
//         return res.status(200).send(items); //and send back what found
//     })
// })

// //api to return files that are asked for downloading
// app.get('/api/users/download/:id',auth,admin,(req,res)=>{
//     const file = path.resolve(".")+`/uploads/${req.params.id}`; //find file path from id
//     res.download(file) //send file back. download is a function from express
// })

//=================================
//             PRODUCTS
//=================================

//Get all products
app.post('/api/products/all', async (req,res)=>{

    //get all the filters
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100; 
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    console.log("------------------allproducts BEGINS--------------------");
    console.log("allproducts: filter:",req.body.filters);

    // process filters array
    for(let key in req.body.filters){
        if(req.body.filters[key].length >0 ){
            if(key === 'price'){ //in case the filter is for price
                findArgs[key] = {
                    $gte: req.body.filters[key][0], //greater or equal than 1st array element
                    $lte: req.body.filters[key][1]  //less or equal than 2nd array element
                }
            }else{
                findArgs[key] = req.body.filters[key]
            }
        }
    }

    if (req.body.admin===true)  findArgs['publish'] = true; //fetches all products that have publish true

    // build filter for when admin and when not
    if (req.body.filters.name!=='') {
        const searchRegex = new RegExp(req.body.filters.name);
        findArgs['name']= searchRegex;
    }  

    console.log("allproducts findargs:",findArgs);

    try {
        const products= await Products.
        find(findArgs).   
        sort([[sortBy,order]]).
        skip(skip).
        limit(limit)

        const recordsCount= await Products.countDocuments(findArgs);
        // console.log('--------------------ALL PRODUCTS:',products);
        console.log('--------------------ALL PRODUCTS: recordsCount:',recordsCount);

        res.status(200).json({
            recordsCount,
            size: products.length,
            products
        })
    } catch (err) {
        return res.status(400).send(err);
    }
});

// Newest
// /filtered?sortBy=createdAt&order=desc&limit=4

// Best selling
// /filtered?sortBy=sold&order=desc&limit=100
app.get('/api/products/filtered',(req,res)=>{

    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : 100;

    Products.
    find({}).
    sort([[sortBy,order]]).
    limit(limit).
    exec((err,products)=>{
        if(err) return res.status(400).send(err);
        console.log("filtered best err=",err);
        res.send(products)
    })
})

//Get a specific product or get an array of products like in cart case
app.get('/api/products/byid',(req,res)=>{
    let type = req.query.type;
    let items = req.query.id;

    console.log("------------products byid Begins----------------");

    console.log("byid: type=",type);
    console.log("byid: items=",items);

    if(type === "array"){//if in request there is 'array'
        let ids = req.query.id.split(',');//get all ids from request
        items = [];
        items = ids.map(item=>{
            return mongoose.Types.ObjectId(item)
        })
    }

    Products.
    find({ '_id':{$in:items}}).
    populate('categories').
    populate('departments').
    exec((err,docs)=>{
        if(err) return res.status(400).send(err);
        return res.status(200).send(docs)
    })
});

//Add products, admin only
app.post('/api/products/addOne',auth,admin, async (req,res)=>{
    
    console.log("-------------------------addOne begins-----------------");
    console.log("addOne: BODY=",req.body);

    const product = new Products(req.body);

    try {
        const addProduct= product.save();

        console.log("addOne: addProduct=",product);

        res.status(200).json({
            success: true,
            product: addProduct
        })
    } catch (err) {
        return res.json({success:false,err});
    }
});
//=================================
app.post('/api/products/removeProduct', auth, admin, async (req, res) => {

    console.log('-----------removeProduct Begins--------------');
    console.log('removeProduct: req.body=',req.body);

    let findArgs={};

    // build filter
    if (req.body.filter.name!=='') {
        const searchRegex = new RegExp(req.body.filter.name);
        findArgs['name']= searchRegex;
    }  

    try {

        await Products.findByIdAndRemove(req.body._id);

        const products = await Products.find(findArgs)
        .skip(req.body.skip)
        .limit(req.body.fetch);

        res.status(200).json(products);

    } catch(err){
        console.log('removeProduct error:',err);
        res.send(err);
    }

});

//=================================

app.post('/api/products/updateProduct', auth, admin, async (req, res) => {

    let findArgs={};
    let newProduct={...req.body};

    delete newProduct["skip"];
    delete newProduct["limit"];
    delete newProduct["filter"];

    console.log('-----------updateProduct Begins--------------');
    console.log('updateProduct: req.body=',req.body);

    if (req.body.filter.name!=='') {
        const searchRegex = new RegExp(req.body.filter.name);
        findArgs['name']= searchRegex;
    } 

    try {
        const update= await Products.findByIdAndUpdate(req.body._id,newProduct,{ new: true });
        console.log('updateProduct: update=',update);

        const products = await Products.find(req.body.filter)
        .skip(req.body.skip)
        .limit(req.body.fetch);

        res.status(200).json(products);

    } catch(err){
        console.log('updateProduct error:',err);
        res.send(err);
    }
});

//=================================
//             CART
//=================================

//add to cart
app.post('/api/cart/addToCart',(req,res)=>{

    let product=req.body;
    let cartToken=req.cookies.etsc_id;

    console.log("------------addToCart Begins----------------");
    
    console.log("API addToCart: req.body=",product)
    console.log("API addToCart: cartToken=",cartToken)

    if (typeof cartToken === 'undefined') { //there is no such cookie
        console.log("API addToCart: cartToken is undefined")
        
        const newCart= new Cart(product);// create new model

        newCart.products=product;

        console.log("writeToDb: new Cart will be stored=",newCart);

        newCart.save((err,doc)=> {
            if(err) return res.json({success:false,err});//if error saving cart 

            console.log("Newcart._id=",newCart._id);

            return res.cookie("etsc_id" , newCart._id).status(200).json(doc.products);
        })

    } else { //there is cookie
        console.log("Cookie is defined")
        Cart.findOne({_id:cartToken},(err,doc)=> { // Search for cart
            if (err) console.log("addToCart API error when cookie is defined: ",err);// Cart error

            let duplicate = false;

            if (doc) { // Cart found

                console.log("Found cart and this is the products:",doc);

                doc.products.forEach((item)=>{//loop through to search if product already in the cart
                    console.log("item=",item);
                    console.log("item in table is",item.product_Id," and productid from the client is ",product.product_Id);
                    console.log("item.id is type",typeof(item.product_Id),"and product.id=",typeof(product.product_Id));
                    if(item.product_Id == product.product_Id && item.size == product.size && item.color == product.color){
                        duplicate = true;  
                    }
                })

                if(duplicate){ //is there already such product in the cart?
                    console.log("Product is duplicated");
                    Cart.findOneAndUpdate(
                        {_id: cartToken, "products.product_Id":mongoose.Types.ObjectId(product.product_Id),
                            "products.color": product.color,
                            "products.size" : product.size
                        }, // find the correct product
                        { 
                            $inc: { "products.$.quantity":product.quantity }},
                        { new:true }, // to return the new cart
                        ()=>{ ///CB
                            
                            console.log("Product is found and is updated and doc.products=",doc);
                            
                            res.status(200).json(doc.products);
                        }
                    )
                } else { // product is not in the cart
        
                    console.log("Product is not duplicated");
        
                    Cart.findOneAndUpdate( //no such other product in the cart
                        {_id: cartToken},//find the cart
                        { $push:{products:{  //add product to cart
                            product_Id: mongoose.Types.ObjectId(product.product_Id), //looking for mongodb object id
                            quantity:product.quantity, //add 1 in quantity
                            size:product.size,
                            color:product.color
                            }
                        }},
                        { new: true },//to get back doc from mongodb
                        (err,doc)=>{//CB
                            if(err) {
                                console.log("Error finding and updating product in cart: ",err);
                                return res.json({success:false,err});}
                                console.log("Will return all ok",doc);
                                res.status(200).json(doc.products) //return cart
                            }   
                        )
                    }

            } else { //User has cookie but Cart not found 
                console.log("cart not found!");
                //TODO: Search users for cart there. If exists use the same. else create newone

                const newCart= new Cart(product);// create new model

                console.log("addToCart newcart just created=",newCart);

                // newCart.products._id=product.product_Id;
                newCart.products=product;

                console.log("addToCart newcart 2nd stage=",newCart);

                console.log("new Cart will be stored=",newCart);

                newCart.save((err,doc)=> {
                    if(err) return res.json({success:false,err});//if error saving cart 

                    console.log("Newcart._id=",newCart._id);

                    return res.cookie("etsc_id" , newCart._id).status(200).json(doc.products);
                })
            }

        
        })

    }
});

//get cart
app.get('/api/cart/getCart',(req,res)=> {
    
    console.log("------------getCart Begins----------------");
    let cartToken=req.cookies.etsc_id;

    if (typeof cartToken === 'undefined') { //there is no such cookie
        console.log("API getCart: cartToken is undefined")
        
        return res.status(200).json({})

    } else { //there is cookie
        console.log("getCart: Cookie is defined");

        Cart.findOne({_id:cartToken}).
        exec((err,doc)=> {
            if (err) console.log("getCart Error: ",err);// Cart finding error

            console.log("getcart: doc if of type",typeof doc);
            if (doc) {//if cart not found
                console.log("Found cart and this is the products:",doc.products);
                res.status(200).json(doc.products)
            } else {// return empty cart
                res.status(200).json({})
            }
        })
    }
})

//removes item from cart
app.post('/api/cart/removeFromCart',(req,res)=>{

    let cartToken=req.cookies.etsc_id;
    let product=req.body;

    console.log("------------removeFromCart Begins----------------");
    
    console.log("API addToCart: req.body=",product)
    console.log("API addToCart: cartToken=",cartToken)

    Cart.findOneAndUpdate(
        {_id: cartToken }, //get the cart
        { "$pull": //remove item from collection
            { "products": {"product_Id":mongoose.Types.ObjectId(product.product_Id), "color":product.color, "size":product.size} } //get products' id from db 
        },
        { new: true },
        (err,doc)=>{ //CB

            if (err) res.status(400).send(err);

            let cart = doc.products; //cart from db
            let array = cart.map(item=>{ //loop through cart and return array with product ids
                return mongoose.Types.ObjectId(item.product_Id)
            });

            Products. //find products
            find({'_id':{ $in: array }}). //loop through array
            populate('category'). //get brand and wood
            populate('department').
            exec((err,cartDetail)=>{ //run the query and return results
                if (err) return res.status(400).send(err);
                return res.status(200).json({
                    cartDetail,
                    cart
                })
            })
        }
    )
});

// Update cart Item
app.post('/api/cart/updateCartItem',(req, res) => {

    let cartToken=req.cookies.etsc_id;
    let product=req.body;

    console.log("------------updateCartItem Begins----------------");
    
    console.log("API updateCartItem: req.body=",product)
    console.log("API updateCartItem: cartToken=",cartToken)

    Cart.findOneAndUpdate(
        {_id: cartToken, "products.product_Id":mongoose.Types.ObjectId(product.product_Id), "products.color":product.color, "products.size":product.size}, //get the cart
        { $set:{"products.$.quantity": product.quantity }},
        {new: true},
        (err,doc)=>{
            if (err) res.status(400).send(err);

            let cart = doc.products;

            console.log("updateCartItem: cart=",cart);

            res.status(200).json({cart});
        })
});

//succesful buy
app.post('/api/cart/successBuy',async (req,res)=>{
    
    let cartToken=req.cookies.etsc_id;
    let body=req.body;
    let cart = [];
    
    let user=req.body.user;
    let userId='';
    let userData={...req.body.userData};
    let paymentData={...req.body.paymentData};
    let shipping=parseInt(req.body.shipping);
    let totalPaid=parseFloat(req.body.totalPaid);

    console.log("------------successbuy Begins----------------");
    
    console.log("API successbuy: req.user=",req.user);

    console.log("API successbuy: cartToken=",cartToken)
    console.log("API successbuy: req.body=",body)
    console.log("------------successbuy Continues----------------");
    
    if (user){ // Find userId
        console.log('successbuy: start to find user');
        Customer.findOne({email:user},(err,doc) => {
            console.log('successbuy: USERID found:',doc);
            userId=doc._id;
        })
    } else {
        console.log('successbuy: user email not found');
        userId='';
    }

    //get cart and store it to cart[]
    await Cart.findOne({_id:cartToken},
        (err,doc) => {
            if (err) console.log("successbuy: Error in getting cart:",err);
            console.log('successbuy: cart findone: doc.products=',doc.products)
            cart=doc.products;
        });

    let order={}; // order object to fill it and then store it to db
    // let transactionData = {} //data we get from Paypal
    const date = new Date();//get system date
    
    //creates an id for the purchase based on seconds and miliseconds and userid hashed by SHA1 (the first 8 chars)
    const po = 'test to fix' //`PO-${date.getSeconds()}${date.getMilliseconds()}-${SHA1(req.cartToken).toString().substring(0,8)}`

    //Build order to store it
    order={
        userId,
        userData,
        pOrder:'', // po
        dateOfPurchase: Date.now(),
        products:cart,
        paymentData,
        shipping,
        totalPaid
    }
    console.log("------------successbuy Continues----------------");
    console.log("successbuy: order=",order);
    console.log("------------successbuy Continues----------------");
    const newOrder= new Order(order);

    await newOrder.save((err,doc) => {
        if (err) console.log("successbuy: error in saving new order:",err);
    });

    await Cart.findByIdAndUpdate({_id:cartToken}, 
        {$set: {
            products:[]
        }},
        {new:true},
        (err,doc)=>{
            if (err) {
                console.log('successbuy: findbyidandupdate: error',error);
                return res.json({success:false,err});
            }
            
            // sendEmail(user.email,user.name,null,"purchase",transactionData);//send thank you email 
            res.status(200).json({ //send all ok and empty cart
                success:true,
                cart: [], //update state on redux
                cartDetail:[]

            });
        });
});


//=================================
//              USERS
//=================================

//api in case user has forgoten user name . receives an email from client
app.post('/api/users/reset_user',(req,res)=>{
    Customer.findOne(//if email is found, continue and run the cb. check model user for more detaiils
        {'email':req.body.email},
        (err,user)=>{//cb
            Customer.generateResetToken((err,user)=>{
                if(err) return res.json({success:false,err});//return error
                sendEmail(user.email,user.name,null,"reset_password",user)//send email
                return res.json({success:true})
            })
        }
    )
})

//api in case user has forgoten pass. sets the new pass
app.post('/api/users/reset_password',(req,res)=>{

    var today = moment().startOf('day').valueOf();//get today date to compare it with token date

    Customer.findOne({//search for token and that token not expired
        resetToken: req.body.resetToken,//get token from params
        resetTokenExp:{
            $gte: today
        }
    },(err,user)=>{//if user is found
        if(!user) return res.json({success:false,message:'Sorry, bad token, try again.'})
    
        user.password = req.body.password; //build object, set new pass
        user.resetToken = '';
        user.resetTokenExp= '';

        user.save((err,doc)=>{ //save and update new pass and from here goes to pre save
            if(err) return res.json({success:false,err});
            return res.status(200).json({
                success: true
            })
        })
    })
})

//Authenticate user by token
app.get('/api/users/auth',auth,(req,res)=>{
        res.status(200).json({
            isAdmin: req.user.role === 0 ? false : true,
            isAuth: true,
            // id:req.user._id,
            email: req.user.email,
            name: req.user.name,
            lastname: req.user.lastname,
            role: req.user.role,
            phone: req.user.phone,
            address: req.user.address
        })
        
})

app.post('/api/users/register',(req,res)=>{
    const customer = new Customer(req.body);//create model

    customer.save((err,doc)=>{//insert customer into db
        if(err) return res.json({success:false,err});//if error return 
        sendEmail(doc.email,doc.name,null,"welcome");//send welcome email
        return res.status(200).json({//return ok
            success: true,
            customerObject:doc
        })
    })
});

// API to login. could be get as well
app.post('/api/users/login',(req,res)=>{
    // find the email
    Customer.findOne({'email':req.body.email},(err,customer)=>{
        if(!customer) return res.json({loginSuccess:false,message:'Email not found'});
        // since email is found, compare the password with provided one
        customer.comparePassword(req.body.password,(err,isMatch)=>{// custom method in the model
            if(!isMatch) return res.json({loginSuccess:false,message:'Wrong password'});//CB function

            // since all ok (passwords match), generate a new token
            customer.generateToken((err,customer)=>{// custom method
                if(err) return res.status(400).send(err);// if error during token generation
                
                // sets cookie name and its value (token)
                res.cookie('w_auth',customer.token).status(200).json({
                    loginSuccess: true
                })
            })
        })
    })
})

//Logout
app.get('/api/users/logout',auth,(req,res)=>{
    Customer.findOneAndUpdate(
        { _id:req.user._id },
        { token: '' },
        (err,doc)=>{
            if(err) return res.json({success:false,err});
            return res.status(200).send({
                success: true
            })
        }
    )
});

//upload images
app.post('/api/users/uploadimage',auth,admin,formidable(),(req,res)=>{
    cloudinary.uploader.upload(req.files.file.path,(result)=>{
        console.log("------------------uploadimage begins--------------");
        console.log("uploadimage: result=",result); //callback starts
        res.status(200).send({
            public_id: result.public_id,
            url: result.secure_url
        })
    },{
        public_id: `${Date.now()}`,//based on documentation
        resource_type: 'auto' //don't know what type of file will be uploaded (jpg, png etc)
    })
})

//get image id from db and remove image from cloudinary
app.get('/api/users/removeimage',auth,admin,(req,res)=>{
    let image_id = req.query.public_id;

    cloudinary.uploader.destroy(image_id,(error,result)=>{
        if(error) return res.json({succes:false,error});
        res.status(200).send('ok');
    })
})

//Update profile API
app.post('/api/users/update_profile',auth, async (req,res)=>{

    console.log("---------------update_profile begins---------------");
    console.log("update_profile: req=",req);

        await Customer.findOneAndUpdate(
            { _id: req.user._id }, //find user
            {
                "$set": req.body //set the new value
            },
            { new: true }, //set the data to the app state
            (err)=>{ //run the cb
                if(err) return res.json({success:false,err});//return error
                return res.status(200).send({ //send success
                    success:true
                })
            }
        );
});

app.post('/api/users/getOrderHistory',auth,(req,res) => {
    let user=req.user;

    console.log('------------------getOrderHistory begins------------------');
    console.log('req.user=',user);
    console.log('------------------getOrderHistory continues------------------')

    Order.find({userId:user._id}, (err, doc) => {
        if (err) console.log('getorderHistory error:',err);
        // console.log('getorderHistory: orders=',doc[0].products);
        return res.send(doc);
    })
})

//=================================
//              CATEGORIES
//=================================

//Add a cateogry, Admin only 
app.post('/api/products/category',auth,admin,(req,res)=>{
    const brand = new Brand(req.body);

    brand.save((err,doc)=>{
        if(err) return res.json({success:false,err});
        res.status(200).json({
            success:true,
            brand: doc
        })
    })
})

//Get all Categories
app.get('/api/products/categories',(req,res)=>{
    Category.find({},(err,categories)=>{
        if(err) return res.status(400).send(err);
        res.status(200).send(categories)
    })
})

//=================================
//              DEPARTMENTS
//=================================

//Add departments, admin only
app.post('/api/products/department',auth,admin,(req,res)=>{
    const department = new Department(req.body);

    department.save((err,doc)=>{
        if(err) return res.json({success:false,err});
        res.status(200).json({
            success: true,
            department: doc
        })
    })
});

//Get all departments
app.get('/api/products/departments',(req,res)=>{
    Department.find({},(err,departments)=>{
        if(err) return res.status(400).send(err);
        res.status(200).send(departments);
    })
})

//=================================
//              SHIPPING
//=================================

// get shipping
app.post('/api/shipping/getShipping', async (req,res) => {

    console.log('----------------getShipping----------------');

    const skip=req.body.skip;
    const limit=req.body.fetch;

    console.log('getShipping: skip=', skip, 'limit=',limit);

    try {

        const shipping = await Shipping
        .find({})
        .skip(skip)
        .limit(limit);
        
        const shippingsCount= await Shipping.countDocuments({});

        console.log('return shippings=',shipping,' count=',shippingsCount );

        res.status(200).json({
            shipping,
            shippingsCount
        });

    } catch(err) {
        console.log('error in getShipping',err);
        return res.status(400).send(err);
    }
});

//=================================
app.post('/api/shipping/addShipping', auth, admin, async (req, res) => {
    console.log('-----------addShipping Begins--------------');
    console.log('addShipping: req.body=',req.body);

    try {
        let newShipping = new Shipping(req.body);
        console.log('addShipping: newShipping=',newShipping);

        const shipping= await newShipping.save();

        res.status(200).json({
           success: true,
           shipping
        }); // returns inserted shipping

    } catch(err){
        console.log('addShipping error:',err);
        res.json({success : false, err});
    }

});
//=================================
app.post('/api/shipping/removeShipping', auth, admin, async (req, res) => {

    console.log('-----------removeShipping Begins--------------');
    console.log('addShipping: req.body=',req.body);

    try {

        await Shipping.findByIdAndRemove(req.body._id);

        const shipping = await Shipping.find({})
        .skip(req.body.skip)
        .limit(req.body.fetch);

        res.status(200).json(shipping);

        console.log('removeShipping: shippings=',shipping);

    } catch(err){
        console.log('removeShipping error:',err);
        res.send(err);
    }

});
//=================================
//              COLORS
//=================================

app.get('/api/colors/getColors',auth, admin, async (req, res) => {

    console.log('----------getColors Begins--------------');
    
    try {

        const colors= await Color.find({});
        res.status(200).send(colors);

    } catch(err){
        res.status(400).send(err);
    }
});
//=================================
app.post('/api/colors/addColor',auth, admin, (req, res) => {

    console.log('----------addColor Begins--------------');
    console.log('addColor: req.body=',req.body);

    let newColor=new Color(req.body);
    console.log('addColor: newColor=',newColor);

    newColor.save((err,doc) => {
        if (err) return res.json({success:false,err});
        res.status(200).json({
            success:true,
            colors: doc
        }); // return inserted color
    });
})
//=================================
app.post('/api/colors/removeColor',auth, admin, async (req, res) => {
    
    console.log('----------removeColor Begins--------------');
    console.log('removeColor: req.body=',req.body);

    try {
        await Color.findByIdAndRemove(req.body._id); 
        const colors=await Color.find({});

        console.log('removeColors: colors=',colors);

        res.status(200).send(colors);
    } catch(err){
        console.log(err);
        res.send(err);
    }
});

//=================================
//              SIZE
//=================================

app.get('/api/size/getSize',auth, admin, async (req,res) => {

    console.log('----------getSize Begins--------------');

    try {
        const size=await Size.find({});

        console.log('getSize: size=',size)

        res.send(size);

    } catch(err){
        console.log(err);
        res.send(err);
    }
})
//=================================
app.post('/api/size/addSize', auth, admin, async (req, res) => {
    console.log('----------addSize Begins--------------');
    console.log('addColor: req.body=',req.body);

    try {
        let newSize=new Size(req.body);
        console.log('addSize: newSize=',newSize);
        const size= await newSize.save();

        res.status(200).json({
            success:true,
            size
        }); // return new size

    } catch(err){
        console.log(err);
        res.status(400).send(err);
    }
});
//=================================
app.post('/api/size/removeSize', auth, admin, async (req, res) => {
    console.log.bind('-----------------removeSize Begins-----------------');

    try {
    
        await Size.findByIdAndRemove(req.body._id);
        const size= await Size.find({});

        console.log('removeSize: size=',size);
        res.status(200).send(size);

    } catch (err){
        console.log(err);
        res.send(err);
    }
})
//=================================
//              FOOTER
//=================================
//get footer data
app.get('/api/site/site_data',(req,res)=>{
    Site.find({},(err,site)=>{ //Uses the model name
        if(err) return res.status(400).send(err);
        res.status(200).send(site[0].siteInfo)
    });
});
//=================================
//update footer data
app.post('/api/site/site_data',auth,admin,(req,res)=>{
    Site.findOneAndUpdate(
        { name: 'Site'},
        { "$set": { siteInfo: req.body }},
        { new: true },
        (err,doc )=>{ //CB returns error and data in doc
            if(err) return res.json({success:false,err});
            return res.status(200).send({
                success: true,
                siteInfo: doc.siteInfo
            })
        }
    )
})
/**
 * Just Checks the role of the user. If it's admin then allows to continue
 *
 */
let admin = (req,res,next) =>{
    if(req.user.role === 0 ){
        return res.send('you are not allowed in this area!!!')
    }
    next();
}

module.exports = { admin }
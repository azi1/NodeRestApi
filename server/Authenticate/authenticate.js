const {user} = require('../models/user');


var authenticate = (req,res,next) => {
    var token = req.header('x-auth');
    user.findByToken(token).then((user) => {
        
        if(!user) {
               return  Promise.reject(); ///this will go to catch case and hence will give same status.
        }
        req.user = user;
        req.token = token;
        next();
    }).catch((e) => {

        res.status(401).send();
    })
}

module.exports = {
    authenticate
}
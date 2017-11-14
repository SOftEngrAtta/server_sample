// var config = require("../../config/config"),
const express = require("express");
const router = express.Router();
const util = require('../services/util');
var generateJwt = function (jwt, user) {

    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    return jwt.sign({
        _id: user._id,
        username: user.name,
        type: user.type,
        email: user.email,
        exp: parseInt(expiry.getTime() / 1000),
    }, "testing");
}


module.exports = function (connection, jwt) {

    let authService = require('../services/auth')(connection);

    router.post("/login", (req, res, next) => {
        let auth = req.body;

        let validationResult = util.validateRequest(auth ,['username' , 'password']);

        if(!validationResult.isValid){
            res.send(validationResult);
        }


        if(validationResult.isValid)
            authService.login(auth)
                .then(success => {
                    if (success.status == 200) {
                        res.json({
                            status: 200,
                            token: generateJwt(jwt, success.user),
                            loginUser: success.user
                        })
                    } else {
                        res.json(success)
                    }

                }, error => {
                    next(error);
                })
    })

    router.post('/signup' , (req , res )=>{
        let signup = req.body ;
        authService.signup(signup).then( success => {
            res.json(success);
        })
        .catch(error=>{
            res.json(error);
        })


    })

    return router;

}



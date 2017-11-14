const models = require('../models');
const  bcrypt = require('bcrypt');

module.exports = function () {
    let authService = {

        login: (auth) => {
            return new Promise((resolve, reject) => {
                let { username, password } = auth;
                models
                    .SmsUser
                    .findOne({ username: username })
                    .then(user => {
                        if (user) {
                            bcrypt.hash(password, user.salt, (error, hash) => {
                                if (hash) {
                                    if (user.password == hash) {
                                        resolve({
                                            status: 200,
                                            text: "login successfully",
                                            user: user
                                        })
                                    } else {
                                        resolve({
                                            status: 401,
                                            text: "Incorrect username or password"
                                        })
                                    }
                                } else {
                                    resolve({
                                        status: 401,
                                        text: "Incorrect username or password"
                                    })
                                }
                            });

                        } else {
                            resolve({
                                status: 401,
                                text: "Incorrect username or password"
                            })
                        }


                    })

            })

        },
        signup: (user) => {
            return new Promise((resolve, reject) => {
                checkAndCreateUser(user)
                    .then(result => {
                        resolve({
                            status: true,
                            message: 'user created'
                        })
                    }, error => {
                        resolve({
                            status: false,
                            message: 'getting error ' + error
                        })
                    })

            })

        }

    }
    return authService;

}

function checkAndCreateUser(userData) {

    return checkUser(userData)
        .then(user => {
            if (user)
                return 'username already exist';
            else
                return createUser(userData).then(success => {
                    return 'user created successfully';
                })
        }).then(success => {
            return success;
        })
}

function checkUser(data) {
    return new Promise((resolve, reject) => {
        let { username } = data;
        models.SmsUser.findOne({ username: username })
            .then(user => {
                if (user) {
                    resolve(user);
                } else {
                    resolve('')
                }
            })
    })
}

function createUser(data) {
    return new Promise((resolve, reject) => {
        let saveUser = new models.SmsUser(data)
        saveUser.save((error, user) => {
            if (user) {
                resolve(user);
            } else {
                reject(error);
            }
        })

    })

}
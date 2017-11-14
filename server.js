const express = require("express"),
    bodyParser = require("body-parser"),
    morgan = require("morgan"),
    mongoose = require('mongoose');
    jwt = require("jsonwebtoken"),
    expjwt = require("express-jwt"),
    cors = require('cors'),
    app = express();

const { port, mongodbURI } = require("./config");

mongoose
  .connect(mongodbURI, {
    useMongoClient: true
  })
  .then(_ => {
    console.log("mongodb connection connected");
    //listen server
   app.listen(port  || 3000, function() {
        console.log("little moon server app listening on port : " + port);
    });
  })
  .catch(error => {
    console.error("mongodb connection error: ", error, error.stack);
  });

app.use(cors())


app.use(morgan("dev"));
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json());

const authenticationRoutes = require("./app/routes/auth")(app , jwt);

app.use("/auth"  , authenticationRoutes);

// Handle Unwanted Requests
app.get("*", function(req, res) {
    res.send("little moon app server status: RUNNING");
})

// Catch unauthorised errors
app.use(function(err, req, res, next) {
    console.log(err);
    res.status(500).json(err);
});

//authentication middleware
function authenticate(req, res, next) {

    try {
        var user = jwt.verify(req.query['token'], 'mysecret');

        if (user) {
            req.user = user;
            next();
        } else {
            throw 'unauthorised';
        }
    } catch (err) {
        next({
            code: 401,
            message: 'invalid token'
        });
    }

}
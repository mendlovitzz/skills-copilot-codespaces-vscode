//Create web server
var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var multer = require('multer');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var path = require('path');
var mongoose = require('mongoose');
var Comment = require('./models/comment');

//Connect to the database
mongoose.connect('mongodb://localhost/comments');

//Configure app to use bodyParser()
//This will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!"}));

var port = process.env.PORT || 8080; //Set the port

//Create a router
var router = express.Router();

//Middleware to use for all requests
router.use(function(req, res, next) {
    //Log
    console.log('Something is happening.');
    next(); //Make sure we go to the next routes and don't stop here
});

//Test route to make sure everything is working
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

//More routes for our API will happen here
//On routes that end in /comments
router.route('/comments')
    //Create a comment (POST http://localhost:8080/api/comments)
    .post(function(req, res) {
        var comment = new Comment(); //Create a new instance of the Comment model
        comment.name = req.body.name; //Set the comment name (comes from the request)
        comment.comment = req.body.comment; //Set the comment text (comes from the request)
        //Save the comment and check for errors
        comment.save(function(err) {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Comment created!' });
        });
    })
    //Get all the comments (GET http://localhost:8080/api/comments)
    .get(function(req, res) {
        Comment.find(function(err, comments) {
            if (err) {
                res.send(err);
            }
            res.json(comments);
        });
    });

//On routes that end in /comments/:comment_id
router.route('/comments/:comment_id')
    //Get the comment with that id (GET http://localhost:8080/api/comments
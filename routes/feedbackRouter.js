var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Feedbacks = require('../models/feedback');
var Verify = require('./verify');

var feedbackRouter = express.Router();
feedbackRouter.use(bodyParser.json());


feedbackRouter.route('/')
    .post(Verify.verifyOrdinaryUser,  function(req, res, next) {
        Feedbacks.create(req.body, function(err, feed) {
            if (err) return next(err);
            console.log('Feedback created!');
            var id = feed._id;

            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Added the feed with id: ' + id);
        });
    })

module.exports = feedbackRouter;
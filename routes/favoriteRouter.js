var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Favorites = require('../models/favorites');

var Verify = require('./verify'); 

var favsRouter = express.Router();
favsRouter.use(bodyParser.json());

favsRouter.route('/')
    .get(Verify.verifyOrdinaryUser, function(req, res, next) {
        Favorites.find({ "postedBy": req.decoded._id })
            .populate('postedBy')
            .populate('dishes')
            .exec(function(err, favorites) {
                if (err) return next(err);

                res.json(favorites[0]);
            });
    })

.post(Verify.verifyOrdinaryUser, function(req, res, next) {
    Favorites.findOne({ "postedBy": req.decoded._id }, function(err, favs) {
        if (!favs) {
            Favorites.create(req.body, function(err, favs) {
                if (err) return next(err);
                favs.postedBy = req.decoded._id;
                console.log('Your favorite list has been created!');
                favs.dishes.push(req.body._id);
                favs.save(function(err, favs) {
                    if (err) return next(err);
                    console.log('Dish added');
                    res.json(favs);
                });
            });

        } else {
            var test = favs.dishes.indexOf(req.body._id);
            if (test > -1) {
                var err = new Error('This dish is already in your favorite list');
                err.status = 401;
                return next(err);
            } else {
                favs.dishes.push(req.body._id);
                favs.save(function(err, favs) {
                    if (err) return next(err);
                    console.log('Dish added to favorites list');
                    res.json(favs);
                });
            }
        }
    });
})

.delete(Verify.verifyOrdinaryUser, function(req, res, next) {
    Favorites.remove({ "postedBy": req.decoded._id }, function(err, resp) {
        if (err) return next(err);
        res.json(resp);
    });
});

favsRouter.route('/:favsId')
    .delete(Verify.verifyOrdinaryUser, function(req, res, next) {
        Favorites.findOne({ postedBy: req.decoded._id }, function(err, favs) {
            if (err) return next(err);
            if (favs) {
                var index = favs.dishes.indexOf(req.params.favsId);
                if (index > -1) {
                    favs.dishes.splice(index, 1);
                }
                favs.save(function(err, favorite) {
                    if (err) return next(err);
                    res.json(favorite);
                });
            } else {
                var err = new Error('There are no Favorites');
                err.status = 401;
                return next(err);
            }
        });
    });

module.exports = favsRouter;

'use strict';

var router = require('express').Router(),
	_ = require('lodash');

var HttpError = require('../../utils/HttpError');
var User = require('./user.model');

router.param('id', function (req, res, next, id) {
	User.findById(id).exec()
	.then(function (user) {
		if (!user) throw HttpError(404);
		req.requestedUser = user;
		next();
	})
	.then(null, next);
});

router.get('/', function (req, res, next) {
	
     if(req.session.passport.user){
     User.find({}).exec()
	.then(function (users) {
		res.json(users);
	})
	.then(null, next);
    } else {
       res.sendStatus(404);
    } 


	
});

router.post('/', function (req, res, next) {
	 if(req.session.passport.user)
	{User.create(req.body)
	.then(function (user) {
		res.status(201).json(user);
	})
	.then(null, next);
    }else {
    	 res.sendStatus(404);
    }


});

router.get('/:id', function (req, res, next) {
	req.requestedUser.getStories()
	.then(function (stories) {
		var obj = req.requestedUser.toObject();
		obj.stories = stories;
		res.json(obj);
	})
	.then(null, next);
});

router.put('/:id', function (req, res, next) {
	_.extend(req.requestedUser, req.body);
	req.requestedUser.save()
	.then(function (user) {
		res.json(user);
	})
	.then(null, next);
});

router.delete('/:id', function (req, res, next) {
	User.findById(req.session.passport.user).
	then(function(user){
		if( user.isAdmin === true)
			{req.requestedUser.remove()
			.then(function () {
				res.status(204).end();
			})
			.then(null, next);}
		else {
			res.sendStatus(401);
		}
	 })
});

module.exports = router;
'use strict';

const controllers = require('./lib/controllers');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://admin:gesloadmin@db:27017/";

const plugin = {};

function odzivi(req, res) {
	console.log(req.body);
	//objekt, ki ga vstavimo v bazo je shranjen v req.body
	MongoClient.connect(url, function(err, db){
		if (err) throw err;
		var dbo = db.db("nodebb");
		dbo.collection("odzivi").insertOne(req.body, function(err, res){
			if (err) throw err;
			db.close();
			console.log("vstavjeno");
		});
	});
	res.redirect("back");
}

plugin.init = function (params, callback) {
	const router = params.router;
	const hostMiddleware = params.middleware;
	// const hostControllers = params.controllers;

	// We create two routes for every view. One API call, and the actual route itself.
	// Just add the buildHeader middleware to your route and NodeBB will take care of everything for you.

	router.get('/admin/plugins/quickstart', hostMiddleware.admin.buildHeader, controllers.renderAdminPage);
	router.get('/api/admin/plugins/quickstart', controllers.renderAdminPage);
	/*
	router.get("/poslji-podatke", function(req, res){
		console.log(req.query.first_name);
		console.log(req.query);
		//res.send("hvala");
		res.redirect('back');
	});*/
	//router.post('/poslji-podatke', odzivi);
	router.post('/odzivi', odzivi);

	callback();
};

plugin.addAdminNavigation = function (header, callback) {
	header.plugins.push({
		route: '/plugins/quickstart',
		icon: 'fa-tint',
		name: 'Quickstart',
	});

	callback(null, header);
};

module.exports = plugin;

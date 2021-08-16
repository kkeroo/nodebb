'use strict';

const controllers = require('./lib/controllers');

const plugin = {};

function odzivi(req, res) {
	console.log(req.body);
	//objekt, ki ga vstavimo v bazo je shranjen v req.body
	var pool = new Pool({
		host: "db",
		port: "5432",
		user: "admin",
		password: "gesloadmin",
		database: "nodebb"
	});

	pool.connect((err, client, done) => {
		if (err) throw err;
		client.query("CREATE TABLE IF NOT EXISTS odzivi (id SERIAL PRIMARY KEY, naslov VARCHAR(100), odziv VARCHAR(5), komentar VARCHAR(100))", (err, res) => {
			done();
			if (err) console.log(err.stack);
		});
	});
	//pool.query("CREATE TABLE IF NOT EXISTS odzivi (id SERIAL PRIMARY KEY, naslov VARCHAR(100), odziv VARCHAR(5), komentar VARCHAR(100))", (err, res) => {
	//	console.log(err, res);
	//});

	const poizvedba = "INSERT INTO odzivi(naslov, odziv, komentar) VALUES('" + req.body.naslov + "', '" + req.body.odziv + "', '" + req.body.komentar + "')";
	//const vrednosti = [req.body.naslov, req.body.odziv, req.body.komentar];

	pool.connect((err, client, done) => {
		if (err) throw err;
		client.query(poizvedba, (err, res) => {
			done();
			if (err) throw err;
			else console.log(res);
		});
	});

	/*
	pool.query(poizvedba, (err, res) => {
		if (err) console.log(err);
		else console.log(res.row[0]);
	});

	pool.end();
*/
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

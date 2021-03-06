'use strict';

const request = require('request');
const requestAsync = require('request-promise-native');
const nconf = require('nconf');
const fs = require('fs');
const winston = require('winston');

const utils = require('../../public/src/utils');

const helpers = module.exports;

helpers.loginUser = function (username, password, callback) {
	const jar = request.jar();

	request({
		url: `${nconf.get('url')}/api/config`,
		json: true,
		jar: jar,
	}, (err, res, body) => {
		if (err || res.statusCode !== 200) {
			return callback(err || new Error('[[error:invalid-response]]'));
		}

		request.post(`${nconf.get('url')}/login`, {
			form: {
				username: username,
				password: password,
			},
			json: true,
			jar: jar,
			headers: {
				'x-csrf-token': body.csrf_token,
			},
		}, (err, res) => {
			if (err || res.statusCode !== 200) {
				return callback(err || new Error('[[error:invalid-response]]'));
			}
			callback(null, jar, body.csrf_token);
		});
	});
};


helpers.logoutUser = function (jar, callback) {
	request({
		url: `${nconf.get('url')}/api/config`,
		json: true,
		jar: jar,
	}, (err, response, body) => {
		if (err) {
			return callback(err, response, body);
		}

		request.post(`${nconf.get('url')}/logout`, {
			form: {},
			json: true,
			jar: jar,
			headers: {
				'x-csrf-token': body.csrf_token,
			},
		}, (err, response, body) => {
			callback(err, response, body);
		});
	});
};

helpers.connectSocketIO = function (res, callback) {
	const io = require('socket.io-client');
	let cookies = res.headers['set-cookie'];
	cookies = cookies.filter(c => /express.sid=[^;]+;/.test(c));
	const cookie = cookies[0];
	const socket = io(nconf.get('base_url'), {
		path: `${nconf.get('relative_path')}/socket.io`,
		extraHeaders: {
			Origin: nconf.get('url'),
			Cookie: cookie,
		},
	});

	socket.on('connect', () => {
		callback(null, socket);
	});

	socket.on('error', (err) => {
		callback(err);
	});
};

helpers.uploadFile = function (uploadEndPoint, filePath, body, jar, csrf_token, callback) {
	let formData = {
		files: [
			fs.createReadStream(filePath),
			fs.createReadStream(filePath), // see https://github.com/request/request/issues/2445
		],
	};
	formData = utils.merge(formData, body);
	request.post({
		url: uploadEndPoint,
		formData: formData,
		json: true,
		jar: jar,
		headers: {
			'x-csrf-token': csrf_token,
		},
	}, (err, res, body) => {
		if (err) {
			return callback(err);
		}
		if (res.statusCode !== 200) {
			winston.error(JSON.stringify(body));
		}
		callback(null, res, body);
	});
};

helpers.registerUser = function (data, callback) {
	const jar = request.jar();
	request({
		url: `${nconf.get('url')}/api/config`,
		json: true,
		jar: jar,
	}, (err, response, body) => {
		if (err) {
			return callback(err);
		}

		if (!data.hasOwnProperty('password-confirm')) {
			data['password-confirm'] = data.password;
		}

		request.post(`${nconf.get('url')}/register`, {
			form: data,
			json: true,
			jar: jar,
			headers: {
				'x-csrf-token': body.csrf_token,
			},
		}, (err, response, body) => {
			callback(err, jar, response, body);
		});
	});
};

// http://stackoverflow.com/a/14387791/583363
helpers.copyFile = function (source, target, callback) {
	let cbCalled = false;

	const rd = fs.createReadStream(source);
	rd.on('error', (err) => {
		done(err);
	});
	const wr = fs.createWriteStream(target);
	wr.on('error', (err) => {
		done(err);
	});
	wr.on('close', () => {
		done();
	});
	rd.pipe(wr);

	function done(err) {
		if (!cbCalled) {
			callback(err);
			cbCalled = true;
		}
	}
};

helpers.invite = async function (body, uid, jar, csrf_token) {
	const res = await requestAsync.post(`${nconf.get('url')}/api/v3/users/${uid}/invites`, {
		jar: jar,
		// using "form" since client "api" module make requests with "application/x-www-form-urlencoded" content-type
		form: body,
		headers: {
			'x-csrf-token': csrf_token,
		},
		simple: false,
		resolveWithFullResponse: true,
	});

	res.body = JSON.parse(res.body);
	return { res, body };
};

require('../../src/promisify')(helpers);

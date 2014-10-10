var stringify = require('json-stringify-safe');
var http = require('http');
var fs = require('fs');
var index = fs.readFileSync('./public/index.html', 'utf8');
var port = 8080;
var lactate = require('lactate');
var fileOptions = { root: './public' };
var files = lactate.dir('public', fileOptions);
var redis = require('redis');
var server = initServer(port);
var redisClient = initRedis();
var Minions = require('minions');
var minions = new Minions(['node']);






function requestHandler(req, res) {
	console.log('REQUEST FOR [%s]', req.url);
	if (req.url === '/' || req.url === '/index.html') {
		return sendIndex(req, res);
	}
	else if (req.url.indexOf('/get/') > -1) {
		return sendJSON(req, res);
	}
	else if (req.url.indexOf('/set/') > -1) {
		return setJSON(req, res);
	}
	return files.serve(req, res);
};


function sendIndex(req, res) {
	var data = { a:1, b: true, c: new Buffer(10), d: "hello" };
	var jsonData = stringify(data);
	var newUUID = uuid();
	var newUrl = '/get/' + newUUID;
	res.writeHead(
		302, 
		{
			'Location': newUrl
		}
	);
	res.end();
};


function sendJSON(req, res) {
	var uuid = req.url.split('/get/').pop();
	getKeyContent(
		uuid,
		function(err, data) {
			var html = renderIndex(data);
			console.log('UUID [%s] === [%s]', uuid, data);
			res.writeHead(200, {'Content-Type': 'text/html'});
			return res.end(html);
		}
	);
};


function getKeyContent(uuid, callback) {
	return redisClient.get(uuid,callback);
};

function setKeyContent(uuid, content, callback) {
	return redisClient.set(uuid,content, callback);
};


function setJSON(req, res) {
	var uuid = req.url.split('/set/').pop();
	return setKeyContent(
		uuid, 
		req.body.json,
		function(err, something) {
			res.end(JSON.stringif(something));
		}
	);
};


function renderIndex(jsonData) {
	var html = index.replace('{{JSONDATA}}', jsonData);
	return html;
};


function initServer(httpPort) {
	return http.createServer(
		requestHandler
	).listen(httpPort);
};


function initRedis() {
	var redisConfig = {
		port: 6379,
		host: '127.0.0.1'
	};
	var redisClient = redis.createClient(redisConfig.port, redisConfig.host, redisConfig.options);
	redisClient.on(
		'error', 
		function(err) {
			throw err;
    }
	);
	return redisClient;
};


function uuid() {
	return minions.randomString(32, true, true, true);
};
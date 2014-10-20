// --[ welcome ;)
var path = require('path');
var stringify = require('json-stringify-safe');
var fs = require('fs');
// --[ lactate
var lactate = require('lactate');
var pubDir = path.normalize(__dirname + '/../public');
var fileOptions = { from: '/' };
var files = lactate.dir('public', fileOptions);
files.enable('autoindex');
// files.enable('debug');
files.set('root', pubDir);
var redis = require('redis');
// --[ redis
var redisClient = initRedis();
// --[ logger
var Lg = require('lg');
var log = new Lg({
	log2console: true,
	loglevel: 1
});
// --[ minions
var Minions = require('minions');
var minions = new Minions(['node']);
// --[ connect
var 
	bodyParser		= require('body-parser'),
	compression		= require('compression'),
	connect				= require('connect'),
	cookieParser	= require('cookie-parser')
	session 			= require('express-session'),
	url						= require('url')
;
var requestHandler = connect();
setupConnect() ;
// --[ session store redis
var redisSessionStore = require('connect-redis')(connect);
var sessionStore = new redisSessionStore(
	{
		host: 'localhost',
		port: '6379',
		prefix: 'njsonsession_',
	}
);
// --[ http server
var http = require('http');
var index = fs.readFileSync(__dirname + '/../public/index.html', 'utf8');
var hostname = 'localhost';
var config = { 
	port: 8080, 
	host: 'localhost', 
	redis: { 
		prefix: 'njson_',
		ttl: 86400 
	},
	baseUrl: 'https://localhost/'
};
// --[ https server
var https = require('https');
var totalGets = 0;
var totalSets = 0;

module.exports = initServer;


// -- [ rock and roll
function setupConnect() {
	requestHandler
		.use(function(req, res, next) {
			// log.add('request for ' + req.url, 'yellow', 'route', 0);
			next();
		})
		.use(function(req, res, next) {
			// log.add('res.send.header', 'yellow', 'connect', 0);
			res.send = send.bind(res);
			res.header = header.bind(res);
			next();
		})
		.use(function(req, res, next) {
			// log.add('req.query', 'yellow', 'connect', 0);
			var url_parts = url.parse(req.url, true);
			req.query = url_parts.query;
			next();
		})
		.use(function(req, res, next) {
			// log.add('bodyParser', 'yellow', 'connect', 0);
			return bodyParser.json({limit: '50mb'})(req, res, next);
		})
		.use(function(req, res, next) {
			// log.add('bodyParser', 'yellow', 'connect', 0);
			return bodyParser.urlencoded({limit: '50mb', extended: true})(req, res, next); 
		})
		.use(function(req, res, next) {
			// log.add('cookieParser', 'yellow', 'connect', 0);
			return cookieParser('n0th1ng')(req, res, next);
		})
		.use(function(req, res, next) {
			// log.add('compression', 'yellow', 'connect', 0);
			return compression()(req, res, next);
		})
		.use(function(req, res, next) {
			// log.add('session', 'yellow', 'connect', 0);
			return session(
				{
					secret: 'n0th1ng',
					cookie: {
						secure: true,
						domain: 'dev-toni.meinunterricht.de',
						path: '/',
						httpOnly: true,
						maxAge: null
					},
					store: sessionStore,
					key: 'njson_sid'
				}
			)(req, res, next); 
		})
		.use(router)
		.use(files.toMiddleware())
		.use(function(req, res, next) {
			// console.log('++++++++++++++++--------->>>>>>>>>>>>>>> END OF CONNECT CHAIN');
			next();
		});
	;
};


function router(req, res, next) {
	var route = req.url.split('?').shift().split('/').pop();
	if (route === '') {
		if (req.method === 'GET') {
			// log.add(' /get ', 'yellow', 'router', 1);
			if (typeof req.query.callback !== 'undefined') {
				return setJSONP(req, res, next);
			}
			return getJSON(req, res, next);
		}	else if (req.method === 'POST') {
			// log.add(' /set ', 'yellow', 'router', 1);
			return setJSON(req, res, next);
		}
	}
	return next();
};


function sendIndex(req, res, next) {
	var newuid = uid();
	var newUrl = '/?id=' + newuid;
	return redirect(req, res, next, newUrl);
};


function getJSON(req, res, next) {
	var uid = req.query.id;
	// if (isUID(uid) === false) {
		// return sendError(req, res);
	// }
	return getKeyContent(
		uid,
		function(err, data) {
			var html = renderIndex(data, uid);
			res.writeHead(200, {'Content-Type': 'text/html'});
			log.add(req.url, 'yellow', 'GET', 1);
			return res.end(html);
		}
	);
};


function getStats() {
	redisClient.get('njson_gets', function(e,tG) { totalGets = tG; } );
	redisClient.get('njson_sets', function(e,tS) { totalSets = tS; } );
};

function getKeyContent(uid, callback) {
	redisClient.incrby('njson_gets', 1, function(e,total) { totalGets = total; } );
	return redisClient.get(config.redis.prefix + uid, callback);
};


function setKeyContent(uid, content, callback) {
	redisClient.incrby('njson_sets', 1, function(e,total) { totalSets = total; } );
	redisClient.set(config.redis.prefix + uid, content, callback);
	return redisClient.expire(config.redis.prefix + uid, config.redis.ttl);
};


function sendError(req, res) {
	res.writeHead(400, {'Content-Type': 'text/json; charset=UTF-8'});
		var answer = { 
			result: 'ERROR',
			message: 'BAD UID',
			url: ' http://' + (config.host || 'localhost') + ':' + config.port + '/' + uid
		};
	return res.end('error. bad input');
};


function setJSON(req, res, next) {
	var uid = req.query.id;
	if (isUID(uid) === false) {
		return sendError(req, res);
	}
	var value = stringify(req.body);
	return setKeyContent(
		uid, 
		value,
		function(err, result) {
			res.writeHead(200, {'Content-Type': 'text/json; charset=UTF-8'});
			var answer = { 
				result: result,
				url: config.baseUrl + '/?id=' + uid
			};
			log.add(answer.url, 'yellow', 'SET', 1);
			return res.end(stringify(answer));
		}
	);
};


function setJSONP(req, res, next) {
	var nonData = [ 'callback', 'id', '_' ];
	var uid = req.query.id;
	var value = null;
	if (isUID(uid) === false) {
		return sendError(req, res);
	}
	for (var n in req.query) {
		if (nonData.indexOf(n) === -1) {
			value = n;
		}
	}
	return setKeyContent(
		uid, 
		value,
		function(err, result) {
			res.writeHead(200, {'Content-Type': 'application/json; charset=UTF-8'});
			var answer = { 
				result: result,
				url: config.baseUrl + '/?id=' + uid
			};
			log.add(answer.url, 'yellow', 'SET_JSONP', 1);
			return res.end(req.query.callback + '(' + stringify(answer) + ')');
		}
	);
};


function renderIndex(jsonData, uid) {
	// TODO: regex or dot this!
	var html = index.replace('{{JSONDATA}}', jsonData, 'g');
	html = html.replace('{{UID}}', uid, 'g');
	html = html.replace('{{UID}}', uid, 'g');
	html = html.replace('{{UID}}', uid, 'g');
	html = html.replace('{{totalSets}}', totalSets, 'g');
	html = html.replace('{{totalGets}}', totalGets, 'g');
	return html;
};


function initServer(port, host, sslOptions) {
	config.port = (port || 8080);
	config.host = host;
	log.add('listening on [' + config.host + ':' + port + ']', 'green', 'server', 1);
	var server = http.createServer(
		requestHandler
	).listen(config.port, config.host);
	server.config = config;
	getStats();
	return server;
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


function uid() {
	return minions.randomString(32, true, true, true);
};


function send(chunk) {
	// simplified version to allow oAuth2 express-dependencies
  var encoding = 'utf8';
	this.header('Content-Type', 'utf-8');	
	switch (typeof chunk) {
    // string defaulting to html
    case 'string':
    case 'boolean':
    case 'number':
    case 'object':
      if (chunk === null) {
        chunk = '';
      } else {
        chunk = JSON.stringify(chunk);
			this.header('Content-Type', 'application/json');
      }
			break;
  }	
	if (typeof chunk !== 'undefined') {
		if (Buffer.isBuffer(chunk) !== true) {
			// convert chunk to Buffer; saves later double conversions
			chunk = new Buffer(chunk, encoding);
			encoding = undefined;
		}
		len = chunk.length;
		this.header('Content-Length', len);
	}
	// strip irrelevant headers
  if (this.statusCode == 204 || this.statusCode == 304) {
    this.removeHeader('Content-Type');
    this.removeHeader('Content-Length');
    this.removeHeader('Transfer-Encoding');
    chunk = '';
  }
	this.end(chunk, encoding);
	return this;
};


function header(field, value) {
	if (arguments.length === 2) {
		if (Array.isArray(value)) {
			value = value.map(String);
		} else {
			value = String(value);
		}
		if ('content-type' == field.toLowerCase() && !/;\s*charset\s*=/.test(value)) {
			var charset = 'utf-8';
		}
		this.setHeader(field, value);
	} else {
		for (var key in field) {
			this.header(key, field[key]);
		}
	}
	return this;
};


function redirect(req, res, next, target) {
	log.add(' REDIRECT [' + req.url + '] sent to [' + target + ']', 'green', 'route.redirect', 1);
	var url = target;
	res.statusCode = (typeof code === 'number') ? code : 302;
	res.setHeader('Content-Type', 'text/html; charset=UTF-8');
	res.setHeader('Location', url);
	res.setEncoding('utf8');
	return res.end();
};


function isUID(input) {
	return (typeof input !== 'string' || uid.length !== input);
};





// --- DEMO AJAX REQUEST

/* 
jQuery.ajax(
	{
		type:'POST',
		dataType:'json',
		url: '/?id=1413208085567nc7h1krufvr9gn5ckfptgq8d19zn7smv',
		data: JSON.stringify({
			a:1, 
			b: 'cant do buffer in client', 
			c: {
				c1: 'test', 
				c2: [1,2,3], 
				c3: { 
					c3a: 0, 
					c3b: 'vier' 
				} 
			} 
		}),
		headers: {
			'content-type': 'application/json;charset=UTF-8'
		},
		success: function(msg){
			console.log(msg);
		}
	}
); 
*/
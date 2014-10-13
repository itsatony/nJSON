
/* 
jQuery.ajax(
	{
			type:'POST',
			dataType:'json',
			url: '/set/1413208085567nc7h1krufvr9gn5ckfptgq8d19zn7smv',
			data: JSON.stringify({
					clientId: '1391787352270T09x2PatW8ua-anb',
					specifier: 'byOauthToken',
					resourceVersion: '2.0.0',
					document: {
						oauthToken: '4f39e4f12ce81f09340002b9'
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

var stringify = require('json-stringify-safe');
var fs = require('fs');
// --[ lactate
var lactate = require('lactate');
var fileOptions = { root: './public' };
var files = lactate.dir('public', fileOptions);
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
var index = fs.readFileSync('./public/index.html', 'utf8');
var hostname = 'localhost';
var config = { 
	port: 8080, 
	host: 'localhost', 
	redis: { 
		ttl: 86400 
	} 
};
// var server = initServer(port);

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
			return bodyParser.json()(req, res, next);
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
		.use(files.toMiddleware())
		.use(router)
		.use(function(req, res, next) {
			console.log('++++++++++++++++--------->>>>>>>>>>>>>>> END OF CONNECT CHAIN');
			next();
		});
	;
};


function router(req, res, next) {
	if (req.url === '/' || req.url === '/index.html') {
		// log.add(' / ', 'yellow', 'router', 1);
		return sendIndex(req, res, next);
	}	else if (req.method === 'GET') {
		// log.add(' /get ', 'yellow', 'router', 1);
		return getJSON(req, res, next);
	}	else if (req.method === 'POST') {
		// log.add(' /set ', 'yellow', 'router', 1);
		return setJSON(req, res, next);
	}
	return next();
};


function sendIndex(req, res, next) {
	var newuid = uid();
	var newUrl = '/' + newuid;
	return redirect(req, res, next, newUrl);
};


function getJSON(req, res, next) {
	var uid = req.url.split('/').pop();
	return getKeyContent(
		uid,
		function(err, data) {
			var html = renderIndex(data);
			res.writeHead(200, {'Content-Type': 'text/html'});
			log.add(req.url, 'yellow', 'GET', 1);
			return res.end(html);
		}
	);
};


function getKeyContent(uid, callback) {
	return redisClient.get(uid,callback);
};


function setKeyContent(uid, content, callback) {
	redisClient.set(uid,content, callback);
	return redisClient.expire(uid, config.redis.ttl);
};


function setJSON(req, res, next) {
	var uid = req.url.split('/').pop();
	if (uid !== 'string' && uid.length !== 45) {
		res.writeHead(400, {'Content-Type': 'text/json'});
			var answer = { 
				result: 'ERROR',
				message: 'BAD UID',
				url: ' http://' + (config.host || 'localhost') + ':' + config.port + '/' + uid
			};
		return res.end('error. bad input');
	}
	var value = stringify(req.body);
	return setKeyContent(
		uid, 
		value,
		function(err, result) {
			res.writeHead(200, {'Content-Type': 'text/json'});
			var answer = { 
				result: result,
				url: ' http://' + (config.host || 'localhost') + ':' + config.port + '/' + uid
			};
			log.add(answer.url, 'yellow', 'SET', 1);
			return res.end(stringify(answer));
		}
	);
};


function renderIndex(jsonData) {
	var html = index.replace('{{JSONDATA}}', jsonData);
	return html;
};


function initServer(port, host) {
	config.port = (port || 8080);
	config.host = host;
	log.add('listening on [' + config.host + ':' + port + ']', 'green', 'server', 1);
	return http.createServer(
		requestHandler
	).listen(config.port, config.host);
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
	res.setHeader('Content-Type', 'text/plain');
	res.setHeader('Location', url);
	return res.end('\n');
};



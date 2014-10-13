var nJSON = require('./njson');
var stringify = require('json-stringify-safe');


function logVar(data, uid) {
	uid = (uid || minions.randomString(32, true, true, true) );
	var send = nJSON.client(
		// value, 
		data,
		'http://localhost:8080/' + uid, 
		function(statusCode, response) {
			console.log('written to [ http://localhost:8080/' + uid + ' ]');
			console.log(response.body); 
			process.exit();
		}
	);
};


var demoVar = {
	a:1, 
	b: new Buffer(10), 
	c: {
		c1: 'test', 
		c2: [1,2,3], 
		c3: { 
			c3a: 0, 
			c3b: 'vier' 
		} 
	} 
};

logVar(demoVar);

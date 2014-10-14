var nJSON = require('./njson');
var stringify = require('json-stringify-safe');


function logVar(data, uid) {
	uid = (uid || minions.randomString(32, true, true, true) );
	var host = process.argv[3] || 'njson.itsatony.com';
	var port = process.argv[2] || 80;
	var url = 'http://' + host + ':' + port + '/?id=' + uid;
	var send = nJSON.client(
		// value, 
		data,
		url, 
		function(result, response) {
			console.log(result); 
			if (response === null) {
				console.log('NO SERVER RUNNING ?');
			} else {
				console.log('written to [ ' + url + ' ]');
			}
			return process.exit();
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

var nJSON = require('./njson');
var njsonClient = nJSON.client();

var Lg = require('lg');
var log = new Lg({
	log2console: true,
	loglevel: 1
});

function logVar(data, uid) {
	uid = (uid || minions.randomString(32, true, true, true) );
	var host = process.argv[3] || 'njson.itsatony.com';
	var port = process.argv[2] || 80;
	var url = 'http://' + host + ':' + port + '/?id=' + uid;
	var send = njsonClient(
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
			c3b: 'four' 
		} 
	} 
};
var demoVar2 = {
	a:2, 
	b: new Buffer(4), 
	c: {
		c1: 'test2', 
		c2: [3,4,5], 
		c3: { 
			c3a: 1, 
			c3b: 'more' 
		}
	} 
};

demoVar.d = demoVar;

logVar(demoVar, '1413293667194d9xwrc1drdmmi4v01kkw63nem000toni');

// log.njson(demoVar2);

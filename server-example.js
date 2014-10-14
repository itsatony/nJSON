var nJSON = require('./njson');
var njsonServer = nJSON.server();

var server = njsonServer(process.argv[2] || 8080);
var nJSON = require('./njson');
var njsonServer = nJSON.server();

var serverHttp = njsonServer(process.argv[2] || 8080);

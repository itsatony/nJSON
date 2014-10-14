var stringify = require('json-stringify-safe');
var restler = require('restler');

function sendJSON(variable, href, callback) {
	// var data = (typeof variable === 'string') ? variable : stringify(variable);
	href = (typeof href === 'string') ?
		href
		:
		'njson.itsatony.com:80'
	;
	return restler.postJson(
			href,
			variable,
			{}
	).on(
		'complete', 
		function(result, response) {
			callback(result, response);
		}
	);
};

module.exports = sendJSON;
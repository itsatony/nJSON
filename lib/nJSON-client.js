var stringify = require('json-stringify-safe');
var restler = require('restler');

function sendJSON(variable, href, callback) {
	var data = (typeof variable === 'string') ? variable : stringify(variable);
	href = (typeof href === 'string') ?
		href
		:
		'njson.itsatony.com:80'
	;
	var rest = restler.post(
		href,
		{
			headers: {
				'Accept': '*/*',
				'Content-Type': 'application/json'
			},
			data: data
		}
	).on(
		'complete', 
		function(result, response) {
			callback(result, response);
		}
	);
	return rest;
};

module.exports = sendJSON;
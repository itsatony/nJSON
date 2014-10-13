var request = require('request');
var stringify = require('json-stringify-safe');
var needle = require('needle');
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
		function(data, response) {
			if (response.statusCode == 201) {
				// you can get at the raw response like this...
			}
			callback(response.statusCode, response);
		}
	);
};

module.exports = sendJSON;
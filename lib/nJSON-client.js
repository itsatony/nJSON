var stringify = require('json-stringify-safe');
var restler = require('restler');

function sendJSON(variable, href, replaceBuffer, callback) {
	callback = (typeof href === 'function' ? href : (typeof replaceBuffer === 'function' ? replaceBuffer : callback));
	replaceBuffer = (typeof href === 'boolean' ? href : (typeof replaceBuffer === 'boolean' ? replaceBuffer : true));
	href = (typeof href === 'string' ? href : 'njson.itsatony.com:80');
	var data = {};
	if (typeof variable !== 'object' || variable instanceof Array) {
		data['_' + typeof variable] = variable;
	} else {
		data = (replaceBuffer === true)
			? 
				stringify(variable, bufferReplacer) 
			:  
				stringify(variable)
		;
	}
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
}

function bufferReplacer(key, value) {
	if (Array.isArray(value) && value.length > 250) {
		var replace = 'Starts: ' + value.slice(0,25).toString() + ' Ends: ' + value.slice(value.length-25, value.length).toString();
		return replace;
	}
	return value;
}

module.exports = sendJSON;
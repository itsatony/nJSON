var nJSON = {
	server: function() { 
		return require('./lib/nJSON-server'); 
	},
	client: function() { 
		return require('./lib/nJSON-client'); 
	}
};

module.exports = nJSON;

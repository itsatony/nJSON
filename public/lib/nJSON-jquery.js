window.njson = function(data, id, callback) {	
	function randomString(length, numbers, alphabetLowerCase, timestamp, alphabetUpperCase) {
		 var id = '';
		if (typeof numbers !== 'boolean') numbers = true;
		if (typeof alphabetLowerCase !== 'boolean') alphabetLowerCase = false;
		if (typeof alphabetUpperCase !== 'boolean') alphabetUpperCase = false;
		if (typeof timestamp !== 'boolean') timestamp = false;
		if (timestamp === true) id += Date.now();
		if (timestamp === true && alphabetLowerCase === false && numbers === false && alphabetUpperCase === false) return id; 
		var chars_alphabet = new Array('a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z');
		var chars_numbers = new Array('1','2','3','4','5','6','7','8','9','0');
		var chars_upperCase = new Array('A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z');		
		var idchars = new Array(0);		
		if(numbers === true){ idchars = idchars.concat(chars_numbers); }
		if(alphabetLowerCase === true){ idchars = idchars.concat(chars_alphabet); }
		if(alphabetUpperCase === true){ idchars = idchars.concat(chars_upperCase); }		
		var lengthIdChars = idchars.length;
		for (var i=0; i < length; i++) {
			id += idchars[Math.floor(Math.random()*lengthIdChars)];
		}		
		return id;
	};	
	var id = (typeof id === 'string' && id.length > 5) 
		? 
			id  
		: 
			randomString(32, true, true, true)
	;	
	jQuery.ajax(
		{
			type:'GET',
			dataType:'jsonp',
			url: 'https://njson.itsatony.com/?id=' + id,
			data: JSON.stringify(data),
			headers: {
				'content-type': 'application/json;charset=UTF-8'
			},
			success: function(msg) {
				console.log('[success]submitted');
				if (typeof callback === 'function') {
					callback(null, msg);
				}
			},
			error: function(err) {
				console.log('[fail!] NOT submitted');
				if (typeof callback === 'function') {
					callback(err, null);
				}
			}
		}
	);
};
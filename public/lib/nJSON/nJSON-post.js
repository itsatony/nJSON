
jQuery(document).ready(
	initialize
);


function initialize() {
	var parameters = getParameters();
	var jsonString = jQuery('#jsonInputData').text();
	var jsonData = JSON.parse(jsonString);
	setId(parameters.id);
	render(jsonData, '');
	bindSave();
	bindRefresh();
	bindReRender();
	return true;
};


function bindRefresh() {
	jQuery('#refresh').on(
		'click',
		function() {
			var id = encodeURIComponent(jQuery('#uidinput').val());
			var url = document.location.search = '?id=' + id;
			document.location.reload();
		}
	);
};


function setId(id) {
	if (typeof id !== 'string' || id.length < 6) {
		id = createUid();
	}
	return jQuery('#uidinput').val(id);
}

function createUid() {
	var uid = Date.now() + 'njsonpost' + Math.floor(Math.random()*10000);
	return uid;
};


function getParameters() {
	var parameters = {};
	var search = document.location.search.split('?');
	if (search.length < 2) {
		return parameters;
	}
	var all = search[1].split('&');
	for (var i = 0; i < all.length; i+=1) {
		kvpair = all[i].split('=');
		parameters[kvpair[0]] = kvpair[1];
	}
	return parameters;
};

function render(obj, chain) {
	if (typeof obj !== 'object' || obj instanceof Array) {
		obj = fakeObject(obj);
	}
	jQuery('#treeContainer').JSONView(obj);
	return obj;
};

function fakeObject(value) {
	var vType = typeof value;
	var fakeObject = {};
	fakeObject[vType] = value;
	return fakeObject;
};

function bindSave() {
	jQuery('#save').on(
		'click',
		save
	);
};

function bindReRender() {
	jQuery('#rerender').on(
		'click',
		function() {
			var jsonString = jQuery('#jsonInputData').val();
			try {
				var data = JSON.parse(jsonString);
			} catch(e) {
				alert('bad format. please correct your JSON');
				return false;
			}
			render(data, '');
		}
	);
};

function save() {
	var id = jQuery('#uidinput').val();
	var jsonString = jQuery('#jsonInputData').val();
	if (jsonString.length < 2) {
		alert('bad format. please correct your JSON');
		return false;
	}
	try {
		var data = JSON.parse(jsonString);
	} catch(e) {
		alert('bad format. please correct your JSON');
		return false;
	}
	jQuery('#save').hide();
	if (typeof id !== 'string' || id.length < 6) {
		id = createUid();
		jQuery('#uidinput').val(id);
	}
	njson(
		data, 
		id, 
		function(requestErr, msg) { 
			if (requestErr !== null) {
				console.log(msg)
				jQuery('#save').show();
				return alert('sorry, something went wrong. not saved!');				
			}
			loadId(id); 
		}
	);
	return true;
};


function loadId(id) {
	document.location.assign('https://njson.itsatony.com/?id=' + id);
};


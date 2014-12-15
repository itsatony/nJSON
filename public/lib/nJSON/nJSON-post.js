
jQuery(document).ready(
	initialize
);


function initialize() {
	bindSave();
	return true;
};

function createUid() {
	var uid = Date.now() + 'njsonpost' + Math.floor(Math.random()*10000);
	return uid;
};


function render(obj, chain) {
	if (typeof obj !== 'object' || obj instanceof Array) {
		obj = fakeObject(obj);
	}
	jQuery('#treeContainer').JSONView(obj);
	jQuery('#chain').text(chain);
	return obj;
};


function bindSave() {
	jQuery('#save').on(
		'click',
		save
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
	if (typeof id !== 'string' || id.length < 4) {
		id = createUid();
		jQuery('#uidinput').val(id);
	}
	njson(json, id, function() { loadId(id); });
	return true;
};


function loadId(id) {
	var url = document.location.pathname = '/index.html?id=' + encodeURIComponent(id);
	document.location.reload();
};


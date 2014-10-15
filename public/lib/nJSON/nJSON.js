
jQuery(document).ready(
	initialize
);


function initialize() {
	var jsonData = JSON.parse(jQuery('#jsonData').text());
	bindRefresh();
	bindFilter();
	render(jsonData, '');
	createFilterAutoComplete();
	return true;
};


function createFilterAutoComplete() {
	var obj = JSON.parse(jQuery('#jsonData').text());
	var suggestions = scanKeys(obj, '');
	jQuery('#filter').autocomplete(
		{ 
			appendTo: '#njson_filter_wrapper',
			minLength: 0,
			select: function(e, ui) {
				var value = ui.item.value;
				var obj = JSON.parse(jQuery('#jsonData').text());				
				obj = filterObject(obj, value, false);
			},
			source: suggestions
		}
	);
	jQuery('#filter').focus();
	return true;
};


function render(obj, chain) {
	if (typeof obj !== 'object' || obj instanceof Array) {
		obj = fakeObject(obj);
	}
	jQuery('#treeContainer').JSONView(obj);
	jQuery('#chain').text(chain);
	return obj;
};


function bindFilter() {
	jQuery('#filter').on(
		'keyup',
		function(e) {
			var obj = JSON.parse(jQuery('#jsonData').text());
			var value = jQuery(this).val();
			var selectAll = true;
			if (e.which === 13 || e.which === 190) {
				if (e.which === 190) {
					selectAll = false;
				}
				obj = filterObject(obj, value, selectAll);
			}
			return false;
		}
	);
};


function bindRefresh() {
	jQuery('#refresh').on(
		'click',
		function() {
			var id = jQuery('#uidinput').val();
			url = document.location.search = '?id=' + id;
			document.loaction.reload();
		}
	);
};


function filterObject(obj, nodeName, select) {
	var name = '';
	var chain = '';
	var chainText = '';
	var newObj = '@@false';
	var result = [ '', null ];
	nodeName = rtrim(nodeName, '.');
	chain = nodeName.split('.');
	if (nodeName.length > 0) {
		name = chain.pop();
		chain.push(name);
		chainText = chain.join('.');		
		result = (chain.length === 1) 
			?
				traverse(obj, name, '')
			:
				getDeepObject(obj, chainText)
		;
		if (result !== false) {
			newObj = result[1];
			chainText = result[0];
		} else {
			newObj = '@@false';
		}
	} else {
		newObj = obj;
	}
	if (select !== false) {
		jQuery('#filter').select();
	}
	if (newObj === '@@false') {
		return render({ njson: 'did not find a match for your filter' }, chainText);
	}
	return render(newObj, chainText);
};


function traverse(obj, name, chain) {
	var subMatch = false;
	if (name.indexOf('.') > -1) {
		var deep = getDeepObject(obj, name);
		obj = deep[1];
		chain = deep[0];
		if (typeof obj !== 'object') {
			return [ chain, obj ];
		}
	}
	for (var n in obj) {
		if (n === name) {
			chain += '.' + n;
			return [ chain, obj[n] ];
		} 
		if (typeof obj[n] === 'object') {
			chain += '.' + n;
			subMatch = traverse(obj[n], name, chain );
			if (subMatch !== false) {
				return subMatch;
			}
		}
	}
	return false;
};


function scanKeys(data, chain, list) {
	var subkeys = [];
	var name = '';
	if (typeof list === 'undefined') {
		list = [];
	}
	if (typeof chain !== 'string') {
		chain = '';
	}
	for (var n in data) {
		name = (chain !== '') 
			?
				chain + '.' + n
			:
				n
		;
		list.push(name);
		if (typeof data[n] === 'object') {
			subkeys = scanKeys(data[n], name, list);
		}
	}
	return list;
};


function getDeepObject(obj, chain) {
	var subs = chain.split('.');
	var subObject = obj;
	var chain = '';
	for (var n=0; n<subs.length; n+=1) {
		if (typeof subObject === 'object' && typeof subObject[subs[n]] !== 'undefined') {
			chain += '.' + subs[n];
			subObject = subObject[subs[n]];
		} else if (n === 0) {
			return false;
		}
	}
	return [ chain, subObject ];
};


function fakeObject(value) {
	var vType = typeof value;
	var fakeObject = {};
	fakeObject[vType] = value;
	return fakeObject;
};


function rtrim(str, chars) {
	chars = chars || "\s";
	return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
};


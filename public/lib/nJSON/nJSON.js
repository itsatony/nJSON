
jQuery(document).ready(
	initialize
);


function initialize() {
	var jsonData = JSON.parse(jQuery('#jsonData').text());
	bindRefresh();
	bindFilter();
	render(jsonData);
	return true;
};

function render(jsonData) {
	jQuery('#treeContainer').JSONView(jsonData);
	return true;
};

function bindFilter() {
	jQuery('#filter').on(
		'keyup',
		function(e) {
			if (e.which === 13) {
				return filter( jQuery(this).val() );
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


function filter(nodeName) {
	var jsonData = JSON.parse(jQuery('#jsonData').text()); 
	var renderData = [ 'filter->', jsonData ];
	if (nodeName.length > 0) {
		renderData = traverse(jsonData, nodeName, 'root');
		if (renderData === false) {
			jQuery('#chain').text('filter->');
			return false;
		}
	}
	jQuery('#chain').text(renderData[0] + '.');
	jQuery('#filter').select();
	return render(renderData[1]);
};


function traverse(data, name, chain) {
	var subMatch = false;
	for (var n in data) {
		if (n === name) {
			return [ chain, data[n] ];
		} 
		if (typeof data[n] === 'object') {
			subMatch = traverse(data[n], name, chain + '.' +n );
			if (subMatch !== false) {
				return subMatch;
			}
		}
	}
	return false;
};



jQuery(document).ready(
	initialize
);


function initialize() {
	var jsonData = JSON.parse(jQuery('#jsonData').text());
	bindRefresh();
	render(jsonData);
	return true;
};

function render(jsonData) {
	jQuery('#treeContainer').JSONView(jsonData);
	return true;
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
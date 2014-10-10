
jQuery(document).ready(
	initialize
);


function initialize() {
	var jsonData = JSON.parse(jQuery('#jsonData').text());
	console.log(jsonData);
	render(jsonData);
	return true;
};

function render(jsonData) {
	jQuery('#treeContainer').JSONView(jsonData);
	return true;
};
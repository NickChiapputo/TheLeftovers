function add() {
	var req = document.getElementById("request").value;
	console.log( req );
	req += '\n';
	var text = document.createTextNode(req);
	var node = document.createElement("LI");
	node.appendChild(text);
	document.getElementById("list").appendChild(node);
	document.getElementById("request").value = "";
}

function remove() {
	var list = document.getElementById("list");
	if (list.childNodes.length > 0) {
	  list.removeChild(list.childNodes[list.childNodes.length - 1]);
	}
}
  
function clearList() {
	var list = document.getElementById("list");
	while (list.childNodes.length > 0) {
	  list.removeChild(list.childNodes[list.childNodes.length - 1]);
	}
	var obj= JSON.parse( sessionStorage.getItem('current_order') );
	obj['notes'] = '';
	sessionStorage.setItem( 'current_order', JSON.stringify( obj ) );
}

function submitList(ordItem) {
	var list = document.getElementById('list');

	// Get children of ol #list
	var children = list.getElementsByTagName( "*" );

	// Special request text for item
	var specRequest = "";

	for( i = 0; i < children.length - 1; i++ )
		specRequest += children[ i ].innerHTML.replace( /^\n|\n$/g, '' ) + "\n";

	// Add the last one without the newline
	specRequest += children[ children.length - 1 ].innerHTML.replace( /^\n|\n$/g, '' );

	if (ordItem == 1) 
	{
		var obj=Cookies.getJSON('current_item');
		obj['notes'] = specRequest;
		Cookies.set('current_item', JSON.stringify(obj), { path: '/', sameSite: 'strict'});
	}
	else 
	{
		var obj= JSON.parse( sessionStorage.getItem('current_order') );
		obj['notes'] = specRequest;
		sessionStorage.setItem( 'current_order', JSON.stringify( obj ) );
	}
}

module.exports = {add, remove, clearList, submitList}
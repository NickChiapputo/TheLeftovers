function initializeTable() {
	// Get value from text input
	var enteredTableNumber = parseInt( document.getElementById( "table-num-input" ).value );

	// Verify that input is valid value
	if( isNaN( enteredTableNumber ) || enteredTableNumber < 1 || enteredTableNumber > 20 )
	{
		alert( "Enter a table number between 1 and 20." );
		return;
	}

	// Query server with table number to ensure it is valid
	var data = { "table" : "" };
	data[ "table" ] = enteredTableNumber; 
	var response = sendData( JSON.stringify( data ) );

	// If successful response, set table ID session storage key-value and navigate to index
	// Otherwise, tell user table ID is invalid
	if( response.status === 200 )
	{
		// Set table ID session storage
		sessionStorage.setItem( 'tableid', enteredTableNumber );

		// Cookies.remove('current_order');
		// Cookies.set('table-num', document.getElementById('table-num-input').value, {path: '/', sameSite: 'strict'});

		// Navigate to customer home page
		location = "index.html";
	}
	else 
	{
		aler( "Invalid table ID.\nEnter a table number between 1 and 20." );
	}
}

function sendData( data )
{
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "POST", "http://64.225.29.130/tables/search", false );
	xmlHttp.send( data );
	return xmlHttp;
}
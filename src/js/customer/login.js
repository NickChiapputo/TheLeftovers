function initializeTable() {
	// Get value from text input
	var enteredTableNumber = parseInt( document.getElementById( "table-num-input" ).value );

	// Verify that input is valid value
	if( isNaN( enteredTableNumber ) || enteredTableNumber < 1 || enteredTableNumber > 20 )
	{
		// Inform user what is acceptable
		alert( "Enter a table number between 1 and 20." );

		// Break out of function
		return;
	}

	// Query server with table number to ensure it is valid
	var data = {};
	data[ "table" ] = enteredTableNumber; 
	var response = communicateWithServer( JSON.stringify( data ), "POST", "http://64.225.29.130/tables/search", false );

	// If successful response, set table ID session storage key-value and navigate to index
	// Otherwise, tell user table ID is invalid
	if( response.status === 200 )
	{
		// Get order for table
		var query = {};
		query[ "table" ] = enteredTableNumber.toString();
		var response = communicateWithServer( JSON.stringify( query ), "POST", "http://64.225.29.130/orders/get", false );

		// If successful, set order session storage, else set order session storage to empty.
		if( response.status === 200 )
		{
			sessionStorage.setItem( 'current_order', JSON.stringify( JSON.parse( response.responseText )[ 0 ] ) );
			console.log( sessionStorage.getItem( 'current_order' ) );
		}

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

function communicateWithServer( data, request, url, asynchronous )
{
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open( request, url, asynchronous );
	xmlHttp.send( data );
	return xmlHttp;
}

module.exports = {initializeTable, communicateWithServer} ;

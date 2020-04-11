function send_order(jsonOrder)
{
	// deleting unimportant variables
	for (ord in jsonOrder) {
		if (ord.happy_hour != undefined) {
			delete ord.happy_hour;
		}
	}

	var xmlHttp = new XMLHttpRequest();

	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 )
		{
			console.log( this.responseText );

			// Response is a JSON object
			var obj = JSON.parse( this.responseText );

			if( obj == null )
			 	console.log("Unable to create item.\n");
			else
                console.log(( 'textarea-create' ).innerHTML = "Created Item: \n" + 
			 		JSON.stringify(obj));
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Create inventory item status response: " + this.status );
		}
	};

	// Send a POST request to 64.225.29.130/inventory/create with selected parameters in key-value format
	xmlHttp.open( "POST", "http://64.225.29.130/test?" + jsonOrder, true );
	xmlHttp.send( jsonOrder );
}
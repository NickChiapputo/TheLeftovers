function getInventoryList() {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) {
			var doc = document.getElementById( 'textarea' );
		
			// Response is a JSON array of items
			var obj = JSON.parse( this.responseText );
			
			var numItems = Object.keys( obj ).length;
			doc.innerHTML = "Number of Inventory Items: " + numItems + "\n";

			var i;
			for( i = 0; i < numItems; i++ )
			{
				var currItem = obj[ i ];
				doc.innerHTML += "Item " + ( i + 1 ) + "\n" + 
						"    Name:  " + currItem.name + "\n" + 
						"    Count: " + currItem.count + "\n\n";
			}
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Request inventory status response: " + this.status );
		}
	};

	// Send a GET request to 64.225.29.130/inventory/view
	xmlHttp.open( "GET", "inventory/view", true );
	xmlHttp.send();
}

function editInventoryItem()
{
	var params = 	"name=" + document.getElementsByName( "name" )[ 0 ].value + 
			"&count=" + document.getElementsByName( "count" )[ 0 ].value;
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) {
			console.log( this.responseText );
			// Response is a JSON object
			var obj = JSON.parse( this.responseText );
			if( obj == null )
				document.getElementById( 'textarea-post' ).innerHTML = "Unable to: find item '" + document.getElementsByName( "name" )[ 0 ].value + "'\n";
			else
				document.getElementById( 'textarea-post' ).innerHTML = "Updated Item: \n" + 
					"    Name:  " + obj.name + "\n" +  
					"    Count: " + obj.count + "\n";
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Edit inventory status response: " + this.status );
		}
	};

	// Send a POST request to 64.225.29.130/inventory/edit with selected parameters in key-value format (?key1=value1&key2=value2 etc.)
	xmlHttp.open( "POST", "inventory/edit?" + params, true );
	xmlHttp.send( params );
}

function editFormSubmit()
{
	editInventoryItem();
	// Function must return false to prevent reloading of page
	return false;
}

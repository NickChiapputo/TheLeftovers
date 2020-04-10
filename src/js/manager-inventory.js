
function getInventoryList() {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) 
		{
			//var doc = document.getElementById( 'textarea-view' );
			var txt ="";
			// Response is a JSON array of items
			var obj = JSON.parse( this.responseText );
			
			var numItems = Object.keys( obj ).length;
//			<!--doc.innerHTML = "<p>Number of Inventory Items: " + numItems + "</p>";-->

			var i;
			txt += "<table style='width:100%; border: 1px solid black;'>" + "<tr><th style=' background-color: black; color: white;'>Item#</th><th style=' background-color: black; color: white;'>Ingredient</th><th style=' background-color: black; color: white;'>Count</th>"
			for( i = 0; i < numItems; i++ )
			{
				var currItem = obj[ i ];
				txt += "<tr><td style=' background-color: white; color: black;'>" + "Item " + ( i + 1 ) + "</td><td style=' background-color: white; color: black;'>" + 
						"    Name:  " + currItem.name + "</td><td style=' background-color: white; color: black;'>" + 
						"    Count: " + currItem.count + "</td></tr>";
			}
			txt += "</table>"
			document.getElementById('invtxt').innerHTML = txt;
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Request inventory status response: " + this.status );
		}
	};

	// Send a GET request to 64.225.29.130/inventory/view
	xmlHttp.open( "GET", "http://64.225.29.130/inventory/view", true );
	xmlHttp.send();
	var x = setTimeout(getInventoryList, 1000);
}

function getInventoryNames() {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) 
		{
			//var doc = document.getElementById( 'textarea-view' );
			var txt ="";
			var txt2 = "";
			// Response is a JSON array of items
			var obj = JSON.parse( this.responseText );
			
			var numItems = Object.keys( obj ).length;
//			<!--doc.innerHTML = "<p>Number of Inventory Items: " + numItems + "</p>";-->

			var i;
			txt += "<table style='width:100%; border: 1px solid black;'>" + "<tr><th style=' background-color: black; color: white;'>Item#</th><th style=' background-color: black; color: white;'>Ingredient</th>"
			for( i = 0; i < numItems; i++ )
			{
				var currItem = obj[ i ];
				txt += "<tr><td style=' background-color: white; color: black;'>" +currItem.name+ "</td><td style=' background-color: white; color: black;'>" + 
						"<button type='reset' onclick='deleteFormSubmit()'>Delete</button>" + "</td></tr>";
			}
			txt += "</table>"
			document.getElementById('delinvtxt').innerHTML = txt;
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Request inventory status response: " + this.status );
		}
	};

	// Send a GET request to 64.225.29.130/inventory/view
	xmlHttp.open( "GET", "http://64.225.29.130/inventory/view", true );
	xmlHttp.send();
}

function editInventoryItem()
{
	var params = {};
	params[ "name" ] = document.getElementsByName( "name-edit" )[ 0 ].value
	params[ "count" ] = document.getElementsByName( "count-edit" )[ 0 ].value
	console.log( "Output Payload: " + JSON.stringify( params ) )
	// var params = 	"name=" + document.getElementsByName( "name-edit" )[ 0 ].value + 
			// "&count=" + document.getElementsByName( "count-edit" )[ 0 ].value;
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) 
		{
			console.log( this.responseText );
			// Response is a JSON object
			var obj = JSON.parse( this.responseText );
			if( obj == null )
				document.getElementById( 'textarea-edit' ).innerHTML = "Unable to: find item '" + document.getElementsByName( "name-edit" )[ 0 ].value + "'\n";
			else
				document.getElementById( 'textarea-edit' ).innerHTML = "Updated Item: \n" + 
					"    Name:  " + obj.name + "\n" +  
					"    Count: " + obj.count + "\n";
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Edit inventory status response: " + this.status );
		}
	};

	// Send a POST request to 64.225.29.130/inventory/edit with selected parameters in key-value format (?key1=value1&key2=value2 etc.)
	xmlHttp.open( "POST", "http://64.225.29.130/inventory/edit", true );
	xmlHttp.send( JSON.stringify( params ) );
}

function editFormSubmit()
{
	editInventoryItem();
	// Function must return false to prevent reloading of page
	return false;
}


function createInventoryItem()
{
	var params = "name=" + document.getElementsByName( "name-create" )[ 0 ].value + 
				"&count=" + document.getElementsByName( "count-create" )[ 0 ].value;

	var xmlHttp = new XMLHttpRequest();

	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 )
		{
			console.log( this.responseText );

			// Response is a JSON object
			var obj = JSON.parse( this.responseText );

			if( obj == null )
			 	document.getElementById( 'textarea-create' ).innerHTML = "Unable to create item.\n";
			else
			 	document.getElementById( 'textarea-create' ).innerHTML = "Created Item: \n" + 
			 		"    Name:  " + obj.name + "\n" + 
			 		"    Count: " + obj.count + "\n";
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Create inventory item status response: " + this.status );
		}
	};

	// Send a POST request to 64.225.29.130/inventory/create with selected parameters in key-value format
	xmlHttp.open( "POST", "http://64.225.29.130/inventory/create?" + params, true );
	xmlHttp.send( params );
}

function createFormSubmit()
{
	createInventoryItem();
	// Function must return false to prevent reloading of page
	return false;
}


function deleteInventoryItem()
{
	var params = "name=" + document.getElementsByName( "name-delete" )[ 0 ].value;
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 )
		{
			console.log( this.responseText );

			// Response is a JSON object
			var obj = JSON.parse( this.responseText );

			if( obj == null || obj.ok != 1 || obj.n != 1 )
				document.getElementById( 'textarea-delete' ).innerHTML = "Unable to delete item.\n";
			else
				document.getElementById( 'textarea-delete' ).innerHTML = "Deleted Item\n";
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Create inventory item status response: " + this.status );
		}
	};

	// Send a POST request to 64.225.29.130/inventory/create with selected parameters in key-value format
	xmlHttp.open( "POST", "http://64.225.29.130/inventory/delete?" + params, true );
	xmlHttp.send( params );
}

function deleteFormSubmit()
{
	deleteInventoryItem();
	// Function must return false to prevent reloading of page
	return false;
}


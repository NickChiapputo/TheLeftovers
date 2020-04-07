function getMenu()
{
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) 
		{
			var doc = document.getElementById( 'textarea-menu-view' );
		
			// Response is a JSON array of items
			var obj = JSON.parse( this.responseText );
			
			var numItems = Object.keys( obj ).length;
      
	//		doc.innerHTML = "Number of Menu Items: " + numItems + "\n";

			var i;
			obj.forEach(function(d) {
				doc.innerHTML+= d.name+"    "+"<button class=\"menu-box\" id=\"food\" onclick=\"displayInfo('"+d.name+"');\"><img style=\"width:120px; height:120px; border-radius:50% \" src=\""+d.image+"\"<button>\n";
			});

		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Request inventory status response: " + this.status );
		}
	};

	// Send a GET request to 64.225.29.130/inventory/view
	xmlHttp.open( "GET", "http://64.225.29.130/menu/view", true );
	xmlHttp.send();
	var x = setTimeout(getInventoryList, 1000);
}

function displayInfo(name)
{
	localStorage.setItem('food-Item',name);
	window.document.location="./viewfood.html";

}

function createMenuItem()
{
	var formData = new FormData( createMenuItemForm );
	formData.append( "fileToUpload", document.getElementById( "menu-item-create-picture" ).files[ 0 ] );

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 )
		{
			var obj = JSON.parse( this.responseText );
			var el = document.getElementById( "textarea-menu-create" );

			el.innerHTML = "Item Created:\n";
			for( var attr in obj )
				el.innerHTML += "    " + attr + ": " + obj[ attr ] + "\n";
			console.log( this.responseText );
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Create menu item status response: " + this.status );
		}
	};

	// Send a POST request to 64.225.29.130/menu/create
	xmlHttp.open( "POST", "http://64.225.29.130/menu/create" );
	xmlHttp.send( formData );
}

function createMenuItemSubmit()
{
	createMenuItem();

	return false;
}

function deleteMenuItem()
{
	var params = "name=" + document.getElementsByName( "name-menu-delete" )[ 0 ].value;

	var xmlHttp = new XMLHttpRequest();

	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 )
		{
			console.log( this.responseText );

			// Response is a JSON object
			var obj = JSON.parse( this.responseText );

			if( obj == null || obj.ok != 1 || obj.n != 1 )
				document.getElementById( 'textarea-menu-delete' ).innerHTML = "Unable to delete item.\n";
			else
				document.getElementById( 'textarea-menu-delete' ).innerHTML = "Deleted Item\n";
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Create inventory item status response: " + this.status );
		}
	};

	// Send a POST request to 64.225.29.130/inventory/create with selected parameters in key-value format
	xmlHttp.open( "POST", "http://64.225.29.130/menu/delete?" + params, true );
	xmlHttp.send( params );
}

function deleteMenuItemFormSubmit()
{
	deleteMenuItem();

	return false;
}
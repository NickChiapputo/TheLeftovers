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
      
			doc.innerHTML = "Number of Menu Items: " + numItems + "\n";

			var i;
			for( i = 0; i < numItems; i++ )
			{
				var currItem = obj[ i ];
				doc.innerHTML += "\nItem " + ( i + 1 ) + "\n";
				for( var attr in currItem )
				{
					if( attr === "ingredients" )
					{
						doc.innerHTML += "    Ingredients:    " + ( currItem.hasIngredient[ 0 ] === 1 ? "(default) " : "          " ) + currItem[ attr ][ 0 ] + " - Uses " + currItem.ingredientCount[ 0 ] + "\n";

						var j;
						for( j = 1; j < Object.keys( currItem.ingredients ).length; j++ )
							doc.innerHTML += "                    " + ( currItem.hasIngredient[ j ] === 1 ? "(default) " : "          " ) + currItem[ attr ][ j ] + " - Uses " + currItem.ingredientCount[ j ] + "\n";
					}
					else if( attr === "hasIngredient" || attr === "ingredientCount" || attr === "_id" )
					{

					}
					else
						doc.innerHTML += "    " + attr + ": " + currItem[ attr ] + "\n";
				}
			}

			// var i;
			// for( i = 0; i < numItems; i++ )
			// {
			// 	var currItem = obj[ i ];
			// 	doc.innerHTML += 	"Item " + ( i + 1 ) + "\n" + 
			// 						"    Name:  " + currItem.name + "\n" + 
			// 						"    Count: " + currItem.count + "\n\n";
			// }
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Request inventory status response: " + this.status );
		}
	};

	// Send a GET request to 64.225.29.130/inventory/view
	xmlHttp.open( "GET", "http://64.225.29.130/menu/view", true );
	xmlHttp.send();
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
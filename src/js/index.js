function getInventoryList() {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) 
		{
			var doc = document.getElementById( 'textarea-view' );
		
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

			console.log( this.responseText );
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			document.getElementById( 'textarea-view' ).innerHTML = "Request inventory status response: " + this.status;
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
			document.getElementById( 'textarea-edit' ).innerHTML = "Edit inventory item status response: " + this.status;
			console.log( "Edit inventory item status response: " + this.status );
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
			document.getElementById( 'textarea-create' ).innerHTML = "Create inventory item status response: " + this.status;
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
			document.getElementById( 'textarea-delete' ).innerHTML = "Delete inventory item status response: " + this.status;
			console.log( "Delete inventory item status response: " + this.status );
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
			document.getElementById( 'textarea-menu-view' ).innerHTML = "Request menu status response: " + this.status;
			console.log( "Request menu status response: " + this.status );
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
			document.getElementById( 'textarea-menu-create' ).innerHTML = "Create menu item status response: " + this.status;
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
			document.getElementById( 'textarea-menu-delete' ).innerHTML = "Delete menu item status response: " + this.status;
			console.log( "Delete menu item status response: " + this.status );
		}
	};

	// Send a POST request to 64.225.29.130/inventory/create with selected parameters in key-value format
	xmlHttp.open( "POST", "http://64.225.29.130/menu/delete", true );
	xmlHttp.send( params );
}

function deleteMenuItemFormSubmit()
{
	deleteMenuItem();

	return false;
}

function loadIngredients()
{
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) 
		{
			var doc = document.getElementById( 'textarea-view' );
		
			// Response is a JSON array of items
			var obj = JSON.parse( this.responseText );
			
			var numItems = Object.keys( obj ).length;
			var el = document.getElementById( "ingredientLabel" );
			var elEdit = document.getElementById( "ingredientLabel-edit" );

			var i;
			for( i = 0; i < numItems; i++ )
			{
				var currItem = obj[ i ];

				var ingredientSrc = 
					'<div class="ingredientArea" style="display: table-row;">' + 
						'<div style="display: table-cell;">' + 
							'<div class="labelIngredient" style="">' + 
								currItem.name + 
							'</div>' + 
						'</div>' + 
						'<div style="display: table-cell;">' + 
							'<div style="display: table; table-layout: fixed; width: 25vw; text-align: center;">' + 
								'<div style="display: table-row;">' + 
									'<div style="display: table-cell;">' + 
										'<input style="" type="checkbox" name="menu-item-create-ingredient-' + 
											( i + 1 ) + 
											'" value="' + 
											currItem.name + 
										'" />' + 
									'</div>' + 
									'<div style="display: table-cell;">' + 
										'<input style="" type="checkbox" name="menu-item-create-has-ingredient-' + 
											( i + 1 ) + 
											'" value="' + 
											'1' + 
										'" />' + 
									'</div>' + 
									'<div style="display: table-cell;">' + 
										'<input style="" type="number" size="5" maxlength="3" name="menu-item-create-ingredient-count-' + 
											( i + 1 ) + 
											'" value="' + 
											currItem.name + 
										'" />' + 
									'</div>' + 
								'</div>' + 
							'</div>' + 
						'</div>' + 
					'</div>';

				el.insertAdjacentHTML( 'afterend', ingredientSrc );

				elEdit.insertAdjacentHTML( 'afterend', ingredientSrc );
			}
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

function getRewardsAccounts()
{
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) 
		{
			var doc = document.getElementById( 'textarea-rewards-accounts-view' );

			console.log( this.responseText );
		
			// Response is a JSON array of items
			var obj = JSON.parse( this.responseText );
			
			var numItems = Object.keys( obj ).length;
			doc.innerHTML = "Number of Rewards Accounts: " + numItems + "\n";

			var i;
			for( i = 0; i < numItems; i++ )
			{
				var currItem = obj[ i ];
				doc.innerHTML += "Item " + ( i + 1 ) + "\n" + 
						"    Name:  " + currItem.name + "\n" + 
						"    Phone Number: " + currItem[ "_id" ] + "\n" + 
						"    Last Order: " + currItem[ "lastMeal" ] + "\n\n";
			}

			console.log( this.responseText );
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			document.getElementById( 'textarea-rewards-accounts-view' ).innerHTML = "Rewards accounts inventory status response: " + this.status;
			console.log( "Rewards accounts inventory status response: " + this.status );
		}
	};

	// Send a GET request to 64.225.29.130/inventory/view
	xmlHttp.open( "GET", "http://64.225.29.130/rewards/view", true );
	xmlHttp.send();
}

function createRewardsAccount()
{
	var params = {};
	params[ "phone" ] = document.getElementsByName( "rewards-account-phone" )[ 0 ].value;
	params[ "name" ] = document.getElementsByName( "rewards-account-name" )[ 0 ].value;

	var xmlHttp = new XMLHttpRequest();

	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 )
		{
			var obj = JSON.parse( this.responseText );
			document.getElementById( 'textarea-rewards-accounts-create' ).innerHTML = "New Account: \n" + 
				"    Name" + obj[ "name" ] + "\n" + 
				"    Phone Number: " + obj[ "_id" ] + "\n" + 
				"    Last Meal: " + obj[ "lastMeal" ] + "\n";
			console.log( this.responseText );
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			document.getElementById( 'textarea-rewards-accounts-create' ).innerHTML = "Create rewards account status response: " + this.status;
			console.log( "Create rewards account status response: " + this.status );
		}
	};

	// Send a POST request to 64.225.29.130/rewards/create with selected parameters
	xmlHttp.open( "POST", "http://64.225.29.130/rewards/create", true );
	xmlHttp.send( JSON.stringify( params ) );
}

function createRewardsAccountSubmit()
{
	createRewardsAccount();
	// Function must return false to prevent reloading of page
	return false;
}

function deleteRewardsAccount()
{
	var params = {};
	params[ "phone" ] = document.getElementsByName( "rewards-account-delete-phone" )[ 0 ].value;

	var xmlHttp = new XMLHttpRequest();

	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 )
		{
			console.log( this.responseText );

			// Response is a JSON object
			var obj = JSON.parse( this.responseText );

			if( obj == null || obj.ok != 1 || obj.n != 1 )
				document.getElementById( 'textarea-rewards-accounts-delete' ).innerHTML = "Unable to delete rewards account.\n";
			else
				document.getElementById( 'textarea-rewards-accounts-delete' ).innerHTML = "Deleted rewards account\n";
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			document.getElementById( 'textarea-rewards-accounts-delete' ).innerHTML = "Delete rewards account status response: " + this.status;
			console.log( "Delete rewards account status response: " + this.status );
		}
	};

	// Send a POST request to 64.225.29.130/rewards/delete with selected parameters
	xmlHttp.open( "POST", "http://64.225.29.130/rewards/delete", true );
	xmlHttp.send( JSON.stringify( params ) );
}

function deleteRewardsAccountSubmit()
{
	deleteRewardsAccount();
	// Function must return false to prevent reloading of page
	return false;
}

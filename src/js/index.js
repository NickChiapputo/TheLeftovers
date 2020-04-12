/*******************************************/
/*       Collapsible Area Functions        */
function uploadFile()
{
	var formData = new FormData();
	formData.append( "fileToUpload", document.getElementById( "file-upload-input" ).files[ 0 ] );

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 )
		{
			var obj = JSON.parse( this.responseText );
			var el = document.getElementById( "textarea-file-upload" );

			el.innerHTML = "File uploaded to " + obj[ "location" ];
			console.log( this.responseText );
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			document.getElementById( 'textarea-file-upload' ).innerHTML = "Upload file status response: " + this.status;
			console.log( "Upload file status response: " + this.status );
		}
	};

	// Send a POST request to 64.225.29.130/files/upload
	xmlHttp.open( "POST", "http://64.225.29.130/files/upload" );
	xmlHttp.send( formData );
}

function fileUploadSubmit()
{
	uploadFile();

	return false;
}
/*******************************************/

/*******************************************/
/*       Collapsible Area Functions        */
function collapse( buttonID, elementID )
{
	// Change button to active class
	document.getElementById( buttonID ).classList.toggle( "active" );

	// Get div document
	var el = document.getElementById( elementID );


	/********* USE THIS FOR STATIC/IMMEDIATE COLLAPSING *****/
	// Toggle between open ("block") and closed ("none")
	// if( el.style.display === "block" )
	// {
	// 	el.style.display = "none";
	// }
	// else
	// {
	// 	el.style.display = "block";
	// }


	/********* USE THIS FOR ANIMATED COLLAPSING *****/
	// Animate sliding
	if( el.style.maxHeight )
	{
		el.style.maxHeight = null;
	}
	else
	{
		el.style.maxHeight = el.scrollHeight + "px";
	}
}
/*******************************************/

/*******************************************/
/*           Inventory Functions           */
function getInventoryList()
{
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
/*******************************************/

/*******************************************/
/*             Menu Functions              */
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
	var params = {};
	params[ "name" ] =  document.getElementsByName( "name-menu-delete" )[ 0 ].value;

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
	console.log( "Sending: " + JSON.stringify( params ) );
	xmlHttp.send( JSON.stringify( params ) ); 
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
/*******************************************/

/*******************************************/
/*        Rewards Account Functions        */
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
			document.getElementById( 'textarea-rewards-accounts-view' ).innerHTML = "Rewards accounts status response: " + this.status;
			console.log( "Rewards accounts status response: " + this.status );
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
/*******************************************/

/*******************************************/
/*             Order Functions             */
function getOrders()
{
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) 
		{
			var doc = document.getElementById( 'textarea-orders-view' );

			// Response is a JSON array of items
			var obj = JSON.parse( this.responseText );
			
			var numItems = Object.keys( obj ).length;
			doc.value = "Number of Orders: " + numItems + "\n\n";
		
			var i;
			
			for( i = 0; i < numItems; i++ )
				doc.value += 	  "Order " + ( i + 1 ) + " (" + obj[ i ][ "status" ] + "): " + obj[ i ][ "_id" ] + "\n"
						+ "    Subtotal: $" + obj[ i ][ "subtotal" ] + "\n"
						+ "    Tax:      $" + obj[ i ][ "tax" ] + "\n"
						+ "    Total:    $" + obj[ i ][ "total" ] + "\n\n";
			doc.value += "\n";

			/*for( i = 0; i < numItems; i++ )
			{
				var currOrder = obj[ i ];
				doc.value += "Order " + ( i + 1 ) + ":\n";
				for( var attr in currOrder )
				{
					if( attr === "items" )
					{
						doc.value += "    " + attr + ":\n"; 
						var numItems = Object.keys( currOrder[ attr ] ).length;
						var j;
						for( j = 0; j < numItems; j++ )
						{
							doc.value += "          Item " + ( j + 1 ) + ":\n"
							var currItem = currOrder[ attr ][ j ];
							for( var itemAttr in currItem )
							{
								if( itemAttr === "ingredients" )
									doc.value += "              " + itemAttr + " (" + Object.keys( currItem[ itemAttr ] ).length + "): " + currItem[ itemAttr ] + "\n";
								else
									doc.value += "              " + itemAttr + ": " + currItem[ itemAttr ] + "\n";
							}
							doc.innerHTML += "\n";
						}

						doc.value += "\n";
					}
					else
						doc.value += "    " + attr + ": " + currOrder[ attr ] + "\n";
				}
			}*/
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			document.getElementById( 'textarea-orders-view' ).innerHTML = "Orders status response: " + this.status;
			console.log( "Orders status response: " + this.status );
		}
	};

	// Send a GET request to 64.225.29.130/inventory/view
	xmlHttp.open( "GET", "http://64.225.29.130/orders/view", true );
	xmlHttp.send();
}

function createOrder()
{
	var order = {};
	order[ "table" ] = document.getElementsByName( "create-order-table-number" )[ 0 ].value;
	order[ "rewards" ] = document.getElementsByName( "create-order-account-number" )[ 0 ].value;

	// Dummy data
	order[ "status" ] = "ordered";
	order[ "items" ] = [
		{
			"name" : "First Item",
			"price" : 3.05,
			"calories" : 1,
			"ingredients" : [
				{ "name" : "First Ingredient" }
			],
			"hasIngredient" : [ 1 ],
			"ingredientCount" : [ 5 ],
			"allergens" : [ "bad food" ],
			"description" : "A sentence.",
			"category" : "food",
			"image" : "http://64.225.29.130/img/yd7b6zdowsr41.jpg"
		},
		{
			"name" : "Second Item",
			"price" : 1.07,
			"calories" : 1,
			"ingredients" : [
				{ "name" : "First Ingredient" }
			],
			"hasIngredient" : [ 1 ],
			"ingredientCount" : [ 5 ],
			"allergens" : [ "bad food" ],
			"description" : "A sentence.",
			"category" : "food",
			"image" : "http://64.225.29.130/img/yd7b6zdowsr41.jpg"
		}
	];

	order[ "notes" ] = "A note.";

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) 
		{
			var obj = JSON.parse( this.responseText );

			document.getElementById( "textarea-order-create" ).innerHTML = "Created Order:\n";
			
			for( var attr in obj )
				document.getElementById( "textarea-order-create" ).innerHTML += "    " + attr + ": "  + obj[ attr ];
		
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			document.getElementById( "textarea-order-create" ).innerHTML = "Status return: " + this.status; + "\n";
		}
	};

	console.log( "Sending: " + JSON.stringify( order ) );

	// Send a GET request to 64.225.29.130/inventory/view
	xmlHttp.open( "POST", "http://64.225.29.130/orders/create", true );
	xmlHttp.send( JSON.stringify( order ) );
}

function createOrderSubmit()
{
	createOrder();
	return false;
}

function deleteOrder()
{
	var order = {};
	order[ "_id" ] = document.getElementsByName( "order-delete-id" )[ 0 ].value;

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 )
		{
			document.getElementById( "textarea-orders-delete" ).innerHTML = "Status response: " + this.status + "\n" + this.responseText;
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			document.getElementById( "textarea-orders-delete" ).innerHTML = "Status response: " + this.status + "\n" + this.responseText;
		}
	};

	console.log( "Sending: " + JSON.stringify( order ) );

	// Send a POST request to 64.225.29.130/orders/delete
	xmlHttp.open( "POST", "http://64.225.29.130/orders/delete" );
	xmlHttp.send( JSON.stringify( order ) );
}

function deleteOrderSubmit()
{
	deleteOrder();
	return false;
}

function payOrder()
{
	var order = {};

	// Get order payment data
	order[ "_id" ] = document.getElementsByName( "order-pay-id" )[ 0 ].value;
	order[ "amount" ] = document.getElementsByName( "order-pay-amount" )[ 0 ].value;
	order[ "method" ] = document.getElementsByName( "order-pay-method" )[ 0 ].value;
	order[ "receipt" ] = document.getElementsByName( "order-pay-receipt-method" )[ 0 ].value;
	order[ "tip" ] = document.getElementsByName( "order-pay-tip-amount" )[ 0 ].value;
	order[ "feedback" ] = document.getElementsByName( "order-pay-feedback" )[ 0 ].value;
	order[ "email" ] = document.getElementsByName( "order-pay-email-address" )[ 0 ].value;

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 )
		{
			document.getElementById( "textarea-orders-pay" ).innerHTML = "Status response: " + this.status + "\n" + this.responseText;
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			document.getElementById( "textarea-orders-pay" ).innerHTML = "Status response: " + this.status + "\n" + this.responseText;
		}
	};

	// Send a POST request to 64.225.29.130/orders/pay
	xmlHttp.open( "POST", "http://64.225.29.130/orders/pay" );
	xmlHttp.send( JSON.stringify( order ) );
}

function payOrderSubmit()
{
	payOrder();
	return false;
}

/*******************************************/
/*             Table Functions             */
function getTables()
{
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) 
		{
			var doc = document.getElementById( 'textarea-tables-view' );

			// Response is a JSON array of items
			var obj = JSON.parse( this.responseText );
			
			var numItems = Object.keys( obj ).length;
			doc.value = "Number of Tables: " + numItems + "\n\n";
		
			var i;
			for( i = 0; i < numItems; i++ )
			{
				var table = obj[ i ];
				doc.value += "Table " + table[ "table" ] + ": " + table[ "status" ] + "\n";
			}
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			document.getElementById( 'textarea-tables-view' ).innerHTML = "Tables status response: " + this.status;
			console.log( "Tables status response: " + this.status );
		}
	};

	// Send a GET request to 64.225.29.130/tables/view
	xmlHttp.open( "GET", "http://64.225.29.130/tables/view", true );
	xmlHttp.send();
}

function createTable()
{
	var table = {};

	// Get table number
	table[ "table" ] = document.getElementsByName( "create-table-number" )[ 0 ].value;

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) 
		{
			// var obj = JSON.parse( this.responseText );

			document.getElementById( "textarea-tables-create" ).innerHTML = "New Table: " + this.responseText;
			
			// for( var attr in obj )
			// 	document.getElementById( "textarea-order-create" ).innerHTML += "    " + attr + ": "  + obj[ attr ];
		
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			document.getElementById( "textarea-tables-create" ).innerHTML = "Status return: " + this.status; + "\n";
		}
	};

	console.log( "Sending: " + JSON.stringify( table ) );

	// Send a POST request to 64.225.29.130/tables/create
	xmlHttp.open( "POST", "http://64.225.29.130/tables/create", true );
	xmlHttp.send( JSON.stringify( table ) );
}

function createTableSubmit()
{
	createTable();

	return false;
}

function updateTableStatus()
{
	var table = {};

	// Get table number
	table[ "table" ] = document.getElementsByName( "table-status-number" )[ 0 ].value;
	table[ "status" ] = document.getElementsByName( "table-status-value" )[ 0 ].value;

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) 
		{
			// var obj = JSON.parse( this.responseText );

			document.getElementById( "textarea-table-status" ).innerHTML = "Test response: " + this.responseText;
			
			// for( var attr in obj )
			// 	document.getElementById( "textarea-order-create" ).innerHTML += "    " + attr + ": "  + obj[ attr ];
		
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			document.getElementById( "textarea-table-status" ).innerHTML = "Status return: " + this.status; + "\n";
		}
	};

	console.log( "Sending: " + JSON.stringify( table ) );

	// Send a POST request to 64.225.29.130/tables/update
	xmlHttp.open( "POST", "http://64.225.29.130/tables/update", true );
	xmlHttp.send( JSON.stringify( table ) );
}

function updateTableStatusSubmit()
{
	updateTableStatus();

	return false;
}
/*******************************************/

/*******************************************/
/*            Employee Functions           */
function getEmployees()
{
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) 
		{
			var doc = document.getElementById( 'textarea-employees-view' );

			// Response is a JSON array of items
			var obj = JSON.parse( this.responseText );
			
			var numItems = Object.keys( obj ).length;
			doc.value = "Number of Employees: " + numItems + "\n\n";
		
			var i;
			for( i = 0; i < numItems; i++ )
			{
				var employee = obj[ i ];
				
				doc.value += "Empoyee " + ( i + 1 ) + ":\n";

				for( var attr in employee )
				{
					if( attr === "shifts" )
					{
						// doc.value += "    " + attr + " -\n";
						doc.value += String( "            " + attr + " -" ).slice( -13 ) + "\n";

						shiftList = employee[ attr ];
						var numShifts = Object.keys( shiftList ).length;
						var j;
						for( j = 0; j < numShifts; j++ )
						{
							var currShift = shiftList[ j ];
							
							var totalTime = ( parseFloat( currShift[ "end" ].toString().substring( 0, 2 ) ) + ( parseFloat( currShift[ "end" ].toString().substring( 3 ) ) / parseFloat( 60 ) ) ) - 
									( parseFloat( currShift[ "start" ].toString().substring( 0, 2 ) ) + ( parseFloat( currShift[ "start" ].toString().substring( 3 ) ) / parseFloat( 60 ) ) );
							
							doc.value += "               " + currShift[ "date" ] + " " + currShift[ "start" ] + " to " + currShift[ "end" ] + " (" + totalTime + " hours)\n";
						}
					}
					else
					{
						// doc.value += "    " + attr + " - " + employee[ attr ] + "\n";
						doc.value += String( "            " + attr + " -" ).slice( -13 ) + "  " + employee[ attr ] + "\n";
					}
				}				
				doc.value += "\n";
			}
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			document.getElementById( 'textarea-employees-view' ).innerHTML = "Employees status response: " + this.status;
			console.log( "Employees status response: " + this.status );
		}
	};

	// Send a GET request to 64.225.29.130/employees/view
	xmlHttp.open( "GET", "http://64.225.29.130/employees/view", true );
	xmlHttp.send();
}

function createEmployee()
{
	var employee = {};

	// Get employee full name
	employee[ "first" ] = document.getElementsByName( "create-employee-first-name" )[ 0 ].value;
	employee[ "middle" ] = document.getElementsByName( "create-employee-middle-name" )[ 0 ].value;
	employee[ "last" ] = document.getElementsByName( "create-employee-last-name" )[ 0 ].value;

	// Get employee type
	employee[ "type" ] = document.getElementsByName( "create-employee-type" )[ 0 ].value;

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) 
		{
			// var obj = JSON.parse( this.responseText );

			document.getElementById( "textarea-employees-create" ).innerHTML = "New Employee: " + this.responseText;
			
			// for( var attr in obj )
			// 	document.getElementById( "textarea-order-create" ).innerHTML += "    " + attr + ": "  + obj[ attr ];
		
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			document.getElementById( "textarea-employees-create" ).innerHTML = "Status return: " + this.status; + "\n";
		}
	};

	console.log( "Sending: " + JSON.stringify( employee ) );

	// Send a POST request to 64.225.29.130/employees/create
	xmlHttp.open( "POST", "http://64.225.29.130/employees/create", true );
	xmlHttp.send( JSON.stringify( employee ) );
}

function createEmployeeSubmit()
{
	createEmployee();

	return false;
}

function employeeLogin()
{
	var employee = {};

	// Get employee information
	employee[ "_id" ] = document.getElementsByName( "employee-login-id" )[ 0 ].value;
	employee[ "pin" ] = document.getElementsByName( "employee-login-pin" )[ 0 ].value;

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) 
		{
			document.getElementById( "textarea-employees-login" ).innerHTML = "Login result: " + this.responseText;
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			document.getElementById( "textarea-employees-login" ).innerHTML = "Status return: " + this.status; + "\n";
		}
	};

	console.log( "Sending: " + JSON.stringify( employee ) );

	// Send a POST request to 64.225.29.130/employees/login
	xmlHttp.open( "POST", "http://64.225.29.130/employees/login", true );
	xmlHttp.send( JSON.stringify( employee ) );
}

function employeeLoginSubmit()
{
	employeeLogin();

	return false;
}

function deleteEmployee()
{
	var params = {};
	params[ "_id" ] = document.getElementsByName( "employee-delete-id" )[ 0 ].value;

	var xmlHttp = new XMLHttpRequest();

	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 )
		{
			console.log( this.responseText );

			// Response is a JSON object
			var obj = JSON.parse( this.responseText );

			if( obj == null || obj.ok != 1 || obj.n != 1 )
				document.getElementById( 'textarea-employees-delete' ).innerHTML = "Unable to delete employee.\n";
			else
				document.getElementById( 'textarea-employees-delete' ).innerHTML = "Deleted Employee\n";
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			document.getElementById( 'textarea-employees-delete' ).innerHTML = "Delete employee status response: " + this.status;
			console.log( "Delete employee status response: " + this.status );
		}
	};

	// Send a POST request to 64.225.29.130/inventory/create with selected parameters in key-value format
	xmlHttp.open( "POST", "http://64.225.29.130/employees/delete", true );
	xmlHttp.send( JSON.stringify( params ) );
}

function employeeDeleteSubmit()
{
	deleteEmployee();

	return false;
}

function employeeChangeShift( create )
{
	// Check if form is valid
	if( document.getElementById( "createShiftForm" ).checkValidity() )
	{
		var shift = {};

		// Get employee ID
		shift[ "_id" ] = document.getElementsByName( "employee-create-shift-id" )[ 0 ].value;

		// Get shift date
		shift[ "date" ] = document.getElementsByName( "employee-create-shift-date" )[ 0 ].value;
		
		// Get start time
		shift[ "start" ] = document.getElementsByName( "employee-create-shift-start-time" )[ 0 ].value
		
		// Get end time
		shift[ "end" ] = document.getElementsByName( "employee-create-shift-end-time" )[ 0 ].value

		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function() {
			if( this.readyState == 4 && this.status == 200 ) 
			{
				document.getElementById( "textarea-employees-" + ( create ? "create" : "remove" ) + "-shift" ).innerHTML = "Shift result: " + this.responseText;
			}
			else if( this.readyState == 4 && this.status != 200 )
			{
				document.getElementById( "textarea-employees-" + ( create ? "create" : "remove" ) + "-shift" ).innerHTML = "Status return: " + this.status; + "\n";
			}
		};

		console.log( "Sending: " + JSON.stringify( shift ) );

		// Send a POST request to 64.225.29.130/employees/shift/create or remove based on source call
		xmlHttp.open( "POST", "http://64.225.29.130/employees/shift/" + ( create ? "create" : "remove" ), true );
		xmlHttp.send( JSON.stringify( shift ) );
	}
	else
	{
		document.getElementById( "textarea-employees-" + ( create ? "create" : "remove" ) + "-shift" ).innerHTML = "Invalid input.";
	}
}

function employeeCreateShiftSubmit( create )
{
	employeeChangeShift( create );

	return false;
}
/*******************************************/

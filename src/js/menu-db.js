const MongoClient = require( 'mongodb' ).MongoClient;
const mongo = require( 'mongodb' );

const http = require( 'http' );
const url = require( 'url' );
const fs = require( 'fs' );
const formidable = require( 'formidable' );

const hostname = 'localhost';
const port = 3005;

const server = http.createServer( ( req, res ) =>  {
	var date = new Date().toISOString().substr( 11, 8 );
	console.log( " \n \n \n(" + date  + "): " );


	res.statusCode = 200;
	res.setHeader( 'Content-Type', 'application/json' );
	res.setHeader( 'Access-Control-Allow-Origin', '*' );

	const MONGO_USERNAME = 'nick';
	const MONGO_PASSWORD = '2bbjcdj7';
	const MONGO_HOSTNAME = '127.0.0.1';
	const MONGO_PORT = '27017';
	const MONGO_DB = 'restaurant';
	
	const dburl = 	"mongodb://" + 
			MONGO_USERNAME + 
	 		":" + 
	 		MONGO_PASSWORD + 
	 		"@" + 
	 		MONGO_HOSTNAME + 
	 		":" + 
	 		MONGO_PORT + 
	 		"/" + 
	 		MONGO_DB + 
	 		"?authSource=admin";

	// Get URL path
	var url_parts = url.parse( req.url, true );
	var path  = url_parts.pathname;
	var query = url_parts.query;

	MongoClient.connect( dburl, function( err, db ) {
	 	if( err ) throw err;

	 	// Select restaurant database and menu-items collection
	 	var collection = db.db( "restaurant" ).collection( "menu-items" );


	 	if( path == "/menu/view" )
	 	{
	 		viewMenuItems( collection, res );
	 	}
	 	else if( path == "/menu/edit" )
	 	{	
	 		// res.statusCode = 501;
	 		// res.end( JSON.stringify( { "response" : "not implemented yet!" } ) );
	 		// return;

			console.log( "Editing Menu Item" );
			var form = new formidable.IncomingForm();
			form.parse( req, function( err, fields, files ) {
				if( err )
				{
					console.log( "Unable to parse form." );

					res.statusCode = 500;
					res.end( JSON.stringify( { "response" : "unable to parse form" } ) );

					throw err;
					return;
				}

				console.log( " \nInput fields:" );
				for( var attr in fields )
					console.log( "    " + attr + ": " + fields[ attr ] );

				// Make sure name is present and valid
				if( fields[ "menu-item-edit-id" ]  === undefined || fields[ "menu-item-edit-id" ] === "" || fields[ "menu-item-edit-id" ].length !== 24 )
				{
					console.log( "Invalid ID." );
					var returnVal = { "response" : "invalid _id" };
					res.statusCode = 400;
					res.end( JSON.stringify( returnVal ) );
					return;
				}

				// Make sure that ingredients are listed


				// Add the ID 
				var item = {}
				item[ "_id" ] = new mongo.ObjectId( fields[ "menu-item-edit-id" ] )
				
				// Add ingredients arrays
				item[ "ingredients" ] = [];
				item[ "hasIngredient" ] = [];
				item[ "ingredientCount" ] = [];

				// Add allergens array
				item[ "allergens" ] = [];

				// Only add fields if they are non-empty
				if( fields[ "menu-item-edit-name" ] !== undefined && fields[ "menu-item-edit-name" ] !== "" )
				{
					console.log( "Editing name." );
					item[ "name" ] = fields[ "menu-item-edit-name" ];
				}

				if( fields[ "menu-item-edit-price" ] !== undefined && fields[ "menu-item-edit-price" ] !== "" && 
					!isNaN( parseFloat( fields[ "menu-item-edit-price" ] ) ) && parseFloat( fields[ "menu-item-edit-price" ] ) >= 0 )
				{
					console.log( "Editing price." );
					item[ "price" ] = parseFloat( fields[ "menu-item-edit-price" ] );
				}

				if( fields[ "menu-item-edit-calories" ] !== undefined && fields[ "menu-item-edit-calories" ] !== "" && 
					!isNaN( parseInt( fields[ "menu-item-edit-calories" ] ) ) && parseInt( fields[ "menu-item-edit-calories" ] ) >= 0 )
				{
					console.log( "Editing calories." );
					item.calories = parseInt( fields[ "menu-item-edit-calories" ] );
				}

				if( fields[ "menu-item-edit-description" ] !== undefined && fields[ "menu-item-edit-description" ] !== "" )
				{
					console.log( "Editing description." );
					item.description = fields[ "menu-item-edit-description" ];
				}
				
				if( fields[ "menu-item-edit-category" ] !== undefined && fields[ "menu-item-edit-category" ] !== "" )
				{
					console.log( "Editing category." );
					item.category = fields[ "menu-item-edit-category" ];
				}

				for( var attr in fields )
				{
					if( attr.startsWith( "menu-item-edit-ingredient-count-" ) )
					{
						// There are 32 characters in 'menu-item-edit-ingredient-count-'
						// Number starts at the 32th space (0-based index)
						var ingredientNum = parseInt( attr.substring( 32 ) );
						
						// If there is not a count value but an ingredient is selected for the count -> bad request
						if( fields[ attr ] === "" && fields[ "menu-item-edit-ingredient-" + ingredientNum ] !== undefined )
						{
							console.log( "Ingredient count does not exist, but there is a corresponding ingredient." );
							var returnVal = { "response" : "missing ingredient count" };
							res.statusCode = 400;
							res.end( JSON.stringify( returnVal ) );
							return;
						}
						else if( fields[ attr ] !== "" && parseInt( fields[ attr ] ) === 0 )
						{
							console.log( "Ingredient count is 0. Not adding " + fields[ "menu-item-edit-ingredient-" + ingredientNum ] + " to ingredient list." );
						}
						else if( fields[ attr ] !== "" && fields[ "menu-item-edit-ingredient-" + ingredientNum ] === undefined )
						{
							console.log( "Ingredient count exists, but there is no corresponding ingredient. (" + ingredientNum + "." );
							var returnVal = { "response" : "missing ingredient for count" };
							res.statusCode = 400;
							res.end( JSON.stringify( returnVal ) );
							return;
						}
						else if( fields[ attr ] !== "" && fields[ "menu-item-edit-ingredient-" + ingredientNum ] !== undefined )
						{
							if( isNaN( parseInt( fields[ attr ] ) ) || parseInt( fields[ attr ] ) < 1 )
							{
								console.log( "Ingredient count is not a valid value (" + parseInt( fields[ attr ] ) + ")." );
								var returnVal = { "response" : "invalid ingredient number" };
								res.statusCode = 400; // Bad request - malformed data
								res.end( JSON.stringify( returnVal ) );
								return;
							}
							else
							{
								console.log( "Adding " + parseInt( fields[ attr ], "10" ) + " of " + fields[ "menu-item-edit-ingredient-" + ingredientNum ] + " (" + 
										fields[ "menu-item-edit-has-ingredient-" + ingredientNum ] == "1" ? 1 : 0 );
								item.ingredientCount.push( parseInt( fields[ attr ], "10" ) );
								item.ingredients.push( fields[ "menu-item-edit-ingredient-" + ingredientNum ] );
								item.hasIngredient.push( fields[ "menu-item-edit-has-ingredient-" + ingredientNum ] == "1" ? 1 : 0 );
							}
						}
						else if( fields[ "menu-item-edit-has-ingredient-" + ingredientNum ] !== undefined )
						{
							console.log( "There is no count or ingredient, but the ingredient is set as default." );
							var returnVal = { "response" : "missing ingredient marked as default" };
							res.statusCode = 400;
							res.end( JSON.stringify( returnVal ) );
							return;
						}
						else
						{
							// There is an empty count and the ingredient does not exist. Nothing to do.
						}
					}
					else if( attr.startsWith( "menu-item-edit-allergens" ) )
					{
						item.allergens.push( fields[ attr ] );
					}
				}

				// Check if there were any ingredients added
				if( item.ingredients === undefined || item.ingredients.length === 0 )
				{
					console.log( "There were no ingredients added." );
					var returnVal = { "response" : "no ingredients" };
					res.statusCode = 400;
					res.end( JSON.stringify( returnVal ) );
					return;
				}


				// If file is attached, upload it to the server and add it to the item
				if( files[ "fileToUpload" ] !== undefined )
				{
					// Create file on server
					var oldpath = files.fileToUpload.path;
					var newpath = '/var/www/html/img/' + files.fileToUpload.name;

					item[ "image" ] = "http://64.225.29.130/img/" + files.fileToUpload.name;

					fs.rename( oldpath, newpath, function( err ) {
						if( err )
						{
							var returnVal = { "response" : "error uploading file" };
							res.end( returnVal );
							throw err;
						}

						console.log( "File uploaded to " + newpath + "." );
					} );
				}

				editMenuItem( item, db, res );
			} );
	 	}
	 	else if( path == "/menu/create" )
	 	{
			console.log( "Creating New Item" );
			var form = new formidable.IncomingForm();
			form.parse( req, function( err, fields, files ) {
				if( err )
				{
					console.log( "Error.\n\n" );
					throw err;
				}

				console.log( " \nInput fields:" );
				for( var attr in fields )
					console.log( "    " + attr + ": " + fields[ attr ] );

				// Make sure all fields are present and valid
				if( 	fields[ "menu-item-create-name" ]  === undefined || fields[ "menu-item-create-name" ]  === "" ||
					fields[ "menu-item-create-price" ] === undefined || isNaN( parseFloat( fields[ "menu-item-create-price" ] ) ) || parseFloat( fields[ "menu-item-create-price" ] ) < 0 ||
					fields[ "menu-item-create-calories" ] === undefined || isNaN( parseInt( fields[ "menu-item-create-calories" ] ) ) || parseInt( fields[ "menu-item-create-calories" ] ) < 0 ||
					fields[ "menu-item-create-description" ] === undefined || fields[ "menu-item-create-description" ] === "" ||
					fields[ "menu-item-create-category" ] === undefined || fields[ "menu-item-create-category" ] === "" )
				{
					console.log( "Bad fields." );
					var returnVal = { "success" : "no" };
					res.statusCode = 400;
					res.end( JSON.stringify( returnVal ) );
					return;
				}

				// Make sure a file is attached
				if( files[ "fileToUpload" ] === undefined )
				{
					console.log( "No file uploaded." );
					var returnVal = { "success" : "no" };
					res.statusCode = 400;
					res.end( JSON.stringify( returnVal ) );
					return;
				}

				// Parse the values 
				var item = {
					"name" : "",
					"price" : 0,
					"calories" : 0,
					"ingredients" : [],
					"hasIngredient" : [],
					"ingredientCount" : [],
					"allergens" : [],
					"description" : "",
					"category" : "",
					"image" : ""
				}
				
				item.name = fields[ "menu-item-create-name" ];
				item.price = parseFloat( fields[ "menu-item-create-price" ] );
				item.calories = parseInt( fields[ "menu-item-create-calories" ] );
				item.description = fields[ "menu-item-create-description" ];
				item.category = fields[ "menu-item-create-category" ];

				for( var attr in fields )
				{
					if( attr.startsWith( "menu-item-create-ingredient-count-" ) )
					{
						// There are 34 characters in 'menu-item-create-ingredient-count-'
						// Number starts at the 34th space (0-based index)
						var ingredientNum = parseInt( attr.substring( 34 ) );
						
						// If there is not a count value but an ingredient is selected for the count -> bad request
						if( fields[ attr ] === "" && fields[ "menu-item-create-ingredient-" + ingredientNum ] !== undefined )
						{
							console.log( "Ingredient count does not exist, but there is a corresponding ingredient." );
							var returnVal = { "succes" : "no" };
							res.statusCode = 400;
							res.end( JSON.stringify( returnVal ) );
							return;
						}
						else if( fields[ attr ] !== "" && parseInt( fields[ attr ] ) === 0 )
						{
							console.log( "Ingredient count is 0. Not adding " + fields[ "menu-item-create-ingredient-" + ingredientNum ] + " to ingredient list." );
						}
						else if( fields[ attr ] !== "" && fields[ "menu-item-create-ingredient-" + ingredientNum ] === undefined )
						{
							console.log( "Ingredient count exists, but there is no corresponding ingredient." );
							var returnVal = { "succes" : "no" };
							res.statusCode = 400;
							res.end( JSON.stringify( returnVal ) );
							return;
						}
						else if( fields[ attr ] !== "" && fields[ "menu-item-create-ingredient-" + ingredientNum ] !== undefined )
						{
							if( isNaN( parseInt( fields[ attr ] ) ) || parseInt( fields[ attr ] ) < 1 )
							{
								console.log( "Ingredient count is not a valid value (" + parseInt( fields[ attr ] ) + ")." );
								var returnVal = { "success" : "no" };
								res.statusCode = 400; // Bad request - malformed data
								res.end( JSON.stringify( returnVal ) );
								return;
							}
							else
							{
								item.ingredientCount.push( parseInt( fields[ attr ], "10" ) );
								item.ingredients.push( fields[ "menu-item-create-ingredient-" + ingredientNum ] );
								item.hasIngredient.push( fields[ "menu-item-create-has-ingredient-" + ingredientNum ] == "1" ? 1 : 0 );
							}
						}
						else if( fields[ "menu-item-create-has-ingredient-" + ingredientNum ] !== undefined )
						{
							console.log( "There is no count or ingredient, but the ingredient is set as default." );
							var returnVal = { "succes" : "no" };
							res.statusCode = 400;
							res.end( JSON.stringify( returnVal ) );
							return;
						}
						else
						{
							// There is an empty count and the ingredient does not exist. Nothing to do.
						}
					}
					else if( attr.startsWith( "menu-item-create-allergens" ) )
					{
						item.allergens.push( fields[ attr ] );
					}
				}

				// Check if there were any ingredients added
				if( item.ingredients.length === 0 )
				{
					console.log( "There were no ingredients added." );
					var returnVal = { "succes" : "no" };
					res.statusCode = 400;
					res.end( JSON.stringify( returnVal ) );
					return;
				}

				// Create file on server
				var oldpath = files.fileToUpload.path;
				var newpath = '/var/www/html/img/' + files.fileToUpload.name;

				fs.rename( oldpath, newpath, function( err ) {
					if( err )
					{
						var returnVal = { "success" : "no" };
						res.end( returnVal );
						throw err;
					}
					
					item[ "image" ] = "http://64.225.29.130/img/" + files.fileToUpload.name;

					// res.end( JSON.stringify( item ) );
					createMenuItem( item, db, res );
				} );
			} );
	 	}
	 	else if( path == "/menu/delete" )
	 	{
	 		// Stringified JSON of updated item
	 		let body = '';

	 		// Asynchronous. Keep appending data until all data is read
	 		req.on( 'data', ( chunk ) => { body += chunk; } );

	 		// Data is finished being read. edit item
	 		req.on( 'end', () => { 
				console.log( "Menu Item Delete Body: '" + JSON.stringify( body ) + "'" );
				deleteMenuItem( JSON.parse( body ), db, res ) 
			});
		}
		else if( path == "/menu/search" )
		{
	 		// Stringified JSON of updated item
	 		let body = '';

	 		// Asynchronous. Keep appending data until all data is read
	 		req.on( 'data', ( chunk ) => { body += chunk; } );

	 		// Data is finished being read. edit item
	 		req.on( 'end', () => { 
	 			console.log( "Search Data Received: " + body );

	 			var obj = JSON.parse( body );

	 			// Verify that name is correct
	 			if( obj[ "name" ] === undefined || obj[ "name" ] === "" )
	 			{
	 				res.statusCode = 400;
	 				res.end( JSON.stringify( { "response" : "bad name" } ) );
	 			}

	 			var item = {}
	 			item[ "name" ] = obj[ "name" ];

	 			findMenuItem( JSON.parse( body ), collection, res ) 
	 		});
		}
		else if( path == "/menu/stats" )
		{
	 		// Stringified JSON of updated item
	 		let body = '';

	 		// Asynchronous. Keep appending data until all data is read
	 		req.on( 'data', ( chunk ) => { body += chunk; } );

	 		// Data is finished being read. edit item
	 		req.on( 'end', () => { 
	 			console.log( "Statistics Search Data Received: " + body );
	 			
				var obj = JSON.parse( body );

	 			// Verify that name is correct
	 			if( obj[ "name" ] === undefined || obj[ "name" ] === "" )
	 			{
	 				res.statusCode = 400;
	 				res.end( JSON.stringify( { "response" : "bad name" } ) );
	 			}

	 			var item = {}
	 			item[ "name" ] = obj[ "name" ];
				
				// Look for matching item in stats table
	 			findMenuItem( JSON.parse( body ), db.db( "restaurant" ).collection( "menu-item-stats" ), res ) 
	 		});
		}
		else if( path == "/menu/view-available" )
		{
			console.log( "View available items." );
			viewAvailable( db, res );	
		}
		else
		{
			console.log( "Invalid path: '" + path + "'.\n\n" );
			res.end( "Error.\n" );
		}
	} );
} );

server.listen( port, hostname, () => {
	// Display time to log for debugging
	var date = new Date().toISOString().substr( 11, 8 );
	console.log(  "(" + date + "): " ); 
});



function viewMenuItems( collection, res )
{
	collection.find( {} ).toArray( function( err, result ) {
		if( err ) throw err;

		console.log( 	"Items found in menu-item database:\n" +
						JSON.stringify( result ) +
						"\n\n" );

		// Send list of items back
		res.end( JSON.stringify( result ) );
	} );
}

async function viewAvailable( db, res )
{
	var menuItemCollection = db.db( "restaurant" ).collection( "menu-items" );
	var inventoryCollection = db.db( "restaurant" ).collection( "inventory" );

	console.log( "Retrieving available menu items." );
	
	try
	{
		// Get list of menu items
		var query = {};
		var menuItemList = await getItems( query, menuItemCollection );

		// Get number of menu items
		var numItems = Object.keys( menuItemList ).length;

		// Get list of ingredients
		var ingredientList = await getItems( query, inventoryCollection );

		// Get number of ingredients
		var numIngredients = Object.keys( ingredientList ).length;

		// Create array with each key being the ingredient name and the value being the number available
		var ingredients = [];
		var i;
		for( i = 0; i < numIngredients; i++ )
		{
			// Get ingredient name
			var name = ingredientList[ i ][ "name" ];
			
			// Get ingredient count
			var count = ingredientList[ i ][ "count" ];

			// Add object to array of ingredients
			ingredients[ name ] = count;
			console.log( "Add " + name + " (" + count + ")  to ingredient list." );
		}

		// Loop through each menu item and check ingredient availability
		for( i = 0; i < numItems; i++ )
		{
			console.log( "Menu item '" + menuItemList[ i ][ "name" ] );

			// Get current menu item ingredient list
			var itemIngredients = menuItemList[ i ][ "ingredients" ];

			// Get current menu item ingredient required counts
			var itemIngredientRequiredCounts = menuItemList[ i ][ "ingredientCount" ];

			// Get number of ingredients
			var numIngredientsInItem = Object.keys( itemIngredients ).length;

			// Loop through each ingredient and check availability.
			// If any do not have enough, remove from menuItemList
			var j;
			for( j = 0; j < numIngredientsInItem; j++ )
			{
				// Get ingredient name
				var ingredientName = itemIngredients[ j ];

				// Get ingredient required count
				var ingredientRequiredCount = itemIngredientRequiredCounts[ j ];

				// Get ingredient count in inventory
				var inventoryCount = ingredients[ ingredientName ];

				// If required count is greater than avaiable, remove menu item from menuItemList
				// Otherwise, continue.
				console.log( "    " + ingredientName + " has " + inventoryCount + " and needs " + ingredientRequiredCount );
				if( ingredientRequiredCount > inventoryCount )
				{
					console.log( "    Item '" + menuItemList[ i ][ "name" ] + "' does not have enough of '" + ingredientName + "' to be ordered." );

					// Remove item from menu list
					menuItemList.splice( i, 1 );

					// Update number of menu items
					numItems--;

					i--;

					// Break out of item ingredient loop
					j = numIngredientsInItem;
				}
			}	
		}

		// Return menu list
		console.log( "Available Menu Items:\n" + JSON.stringify( menuItemList ) );
		res.end( JSON.stringify( menuItemList ) );
	}
	catch( e )
	{
		console.log( "Fatal error reading available menu items.\nError log: " + e.message );

		res.statusCode = 500;
		res.end( JSON.stringify( { "response" : "fatal error reading available menu items" } ) );
		return;
	}
}


async function editMenuItem( updatedQuery, db, res )
{
	var menuCollection = db.db( "restaurant" ).collection( "menu-items" );
	var statCollection = db.db( "restaurant" ).collection( "menu-item-stats" );

	var query = {};
	query[ "_id" ] = updatedQuery[ "_id" ];
	console.log( "Attempting to edit menu item with _id '" + query[ "_id" ] + "'." );

	var action = { $set : updatedQuery };
	var options = { returnOriginal: false, returnNewDocument: true };

	// Update name in stats item if name is being changed
	var updateStats = updatedQuery[ "name" ] !== undefined && updatedQuery[ "name" ] !== "";
	var statQuery;
	var statAction;

	if( updateStats )
	{
		// Get original name by _id
		var originalMenuItem;
		
		try
		{
			originalMenuItem = await getItem( query, menuCollection );
			if( originalMenuItem === null )
			{
				console.log( "null response when searching for original stats item" );

				res.statusCode = 500;
				res.end( JSON.stringify( { "response" : "unable to find stats item" } ) );
				return;
			}
		}
		catch( e )
		{
			console.log( "Error searching for original item.\nError log: " + e.message );

			res.statusCode = 500;
			res.end( JSON.stringify( { "response" : "fatal error searching for stats item" } ) );
			return;
		}

		console.log( "Attempting to change name of item from '" + originalMenuItem[ "name" ] + "' to '" + updatedQuery[ "name" ] + "'." );

		// Query to search for during update
		statQuery = {};
		statQuery[ "name" ] = originalMenuItem[ "name" ];

		var statUpdateQuery = {};
		statUpdateQuery[ "name" ] = updatedQuery[ "name" ];

		// Action to perform (set name) during update
		statAction = { $set : statUpdateQuery };
	}


	var menuEditResult;
	var statEditResult;

	try
	{
		menuEditResult = await updateItem( query, action, menuCollection, options );

		if( updateStats )
			statEditResult = await updateItem( statQuery, statAction, statCollection, options )
	}
	catch( e )
	{
		console.log( "Unable to complete menu edit or stat edit.\nError log: " + e.message + "\n \n " );
		res.statusCode = 500;
		res.end( JSON.stringify( { "response" : "unable to complete edit" } ) );
		return;
	}

	if( menuEditResult.value === null )
	{
		console.log( "Did not find menu item." );

		res.statusCode = 400;
		res.end( JSON.stringify( { "response" : "unable to find menu item" } ) );
		return;
	}

	if( updateStats && statEditResult.value === null )
	{
		console.log( "Did not find menu item stats." );

		res.statusCode = 400;
		res.end( JSON.stringify( { "response" : "unable to find menu item stats" } ) );
		return;
	}

	console.log( "Item edited in menu-item database:\n" + JSON.stringify( menuEditResult ) +"\n\n" );

	if( updateStats )
		console.log( "Item edited in menu-item database:\n" + JSON.stringify( statEditResult ) +"\n\n" );

	// Send updated value back
	res.end( JSON.stringify( menuEditResult.value ) );
}

async function updateItem( query, action, collection, options )
{
	return collection.findOneAndUpdate( query, action, options );
}

async function getItem( query, collection )
{
	return collection.findOne( query );
}

async function getItems( query, collection )
{
	return collection.find( query ).toArray();
}

async function createMenuItem( menuItem, db, res )
{
	var menuCollection = db.db( "restaurant" ).collection( "menu-items" );
	var statCollection = db.db( "restaurant" ).collection( "menu-item-stats" );

	var statItem = {};
	statItem[ "name" ] = menuItem[ "name" ];

	var menuInsertResult;
	var statInsertResult;

	try
	{
		menuInsertResult = await insertItem( menuItem, menuCollection );
		statInsertResult = await insertItem( statItem, statCollection );
	}
	catch( e )
	{
		console.log( "Unable to complete menu insert or stat insert.\nError log: " + e.message );
		res.statusCode = 500;
		res.end( JSON.stringify( { "response" : "unable to complete insertion" } ) );
		return;
	}

	console.log( "Menu Item Insert Result: " + JSON.stringify( menuInsertResult ) );
	console.log( "Stat Item Insert Result: " + JSON.stringify( statInsertResult ) );

	if( menuInsertResult && statInsertResult )
	{
		res.statusCode = 200;
		res.end( JSON.stringify( menuInsertResult.ops[ 0 ] ) );
	}
	else
	{
		res.statusCode = 500;
		res.end( JSON.stringify( { "response" : "insert for menu or stat item is null" } ) );
	}
}

async function insertItem( item, collection )
{
	return collection.insertOne( item );
}

async function deleteMenuItem( query, db, res )
{
	var menuCollection = db.db( "restaurant" ).collection( "menu-items" );
	var statCollection = db.db( "restaurant" ).collection( "menu-item-stats" );

	var item = {};
	item[ "name" ] = query.name;

	console.log( "Attempting to delete item with name: '" + deleteItem.name + "'.\n" );

	var menuDeleteResult;
	var statDeleteResult;

	try
	{
		menuDeleteResult = await deleteItem( item, menuCollection );
		statDeleteResult = await deleteItem( item, statCollection );
	}
	catch( e )
	{
		console.log( "Unable to complete menu item delete or stat delete.\nError log: " + e.message );
		res.statusCode = 500;
		res.end( JSON.stringify( { "response" : "unable to complete deletion" } ) );
		return;
	}

	console.log( "Menu Item Delete Result: " + JSON.stringify( menuDeleteResult ) );
	console.log( "Stat Item Delete Result: " + JSON.stringify( statDeleteResult ) );

	if( menuDeleteResult && statDeleteResult )
	{
		res.statusCode = 200;
		res.end( JSON.stringify( menuDeleteResult ) );
	}
	else
	{
		res.statusCode = 500;
		res.end( JSON.stringify( { "response" : "delete for menu or stat item is null" } ) );
	}
}

async function deleteItem( item, collection )
{
	return collection.deleteOne( item );
}

function findMenuItem( name, collection, res )
{
	collection.findOne( name, function( err, result ) {
		if( err ) 
		{
			console.log( "Error searching collection." );

			res.statusCode = 500;
			res.end( JSON.stringify( { "result" : "error searching collection" } ) );
			throw err;
			return;
		}

		if( result === null )
		{
			console.log( "Item not found in table." );

			res.statusCode = 500;
			res.end( JSON.stringify( { "result" : "could not find item" } ) );
			return;
		}

		console.log( 	"Items found in menu-item database:\n" +
						JSON.stringify( result ) +
						"\n\n" );

		// Send item back
		res.end( JSON.stringify( result ) );
	} );
}

function getStats( name, collection, res )
{

}


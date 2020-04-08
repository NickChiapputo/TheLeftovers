const MongoClient = require( 'mongodb' ).MongoClient;

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
	 		// Stringified JSON of updated item
	 		let body = '';

	 		// Asynchronous. Keep appending data until all data is read
	 		req.on( 'data', ( chunk ) => { body += chunk; } );

	 		// Data is finished being read. edit item
	 		req.on( 'end', () => { editMenuItem( JSON.parse( body ), collection, res ) } );
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
					fields[ "menu-item-create-price" ] === undefined || isNaN( parseFloat( fields[ "menu-item-create-price" ] ) ) || parseFloat( fields[ "menu-item-create-price" ] ) <= 0 ||
					fields[ "menu-item-create-calories" ] === undefined || isNaN( parseInt( fields[ "menu-item-create-calories" ] ) ) || parseInt( fields[ "menu-item-create-calories" ] ) <= 0 ||
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
					createMenuItem( item, collection, res );
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
				deleteMenuItem( JSON.parse( body ), collection, res ) 
			});
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


function editMenuItem( updatedQuery, collection, res )
{
	var query = {};
	query[ "name" ] = updatedQuery.name;

	collection.findOneAndUpdate( query, { $set: updatedQuery }, { returnOriginal: false, returnNewDocument: true }, 
		function( err, result ) {
			if( err ) throw err;

			console.log( 	"Item edited in menu-item database:\n" + 
				JSON.stringify( result.value ) +
				"\n\n" );

			// Send updated value back
			res.end( JSON.stringify( result.value ) );
		}
	);
}

function createMenuItem( newItem, collection, res )
{
	collection.insertOne( newItem, function( err, result ) {
 		if( err )
		{
			console.log( "Error inserting new item." );
			res.statusCode = 500;
			res.end( JSON.stringify( { "success" : "no" } ) );
			throw err;
		}

		console.log( 	"Item created in menu-item database:\n" + 
						JSON.stringify( result.ops[ 0 ] ) +
						"\n\n" );

		console.log( "New Item: " );
		for( var attr in newItem )
			console.log( "    " + attr + ": " + newItem[ attr ] );

		// Send item created back
 		res.end( JSON.stringify( result.ops[ 0 ] ) );
 	} );
}

function deleteMenuItem( query, collection, res )
{
	var deleteItem = {};
	deleteItem[ "name" ] = query.name;

	console.log( "Attempting to delete item with name: '" + deleteItem.name + "'.\n" );

		collection.deleteOne( deleteItem, function( err, result ) {
 		if( err ) throw err;

			console.log( 	"Result of removing item from menu-item database:\n" +
				JSON.stringify( result.result ) + 
				"\n\n" );

			// Send status of removing item back
 		res.end( JSON.stringify( result.result ) + "\n" );
 	} );
}

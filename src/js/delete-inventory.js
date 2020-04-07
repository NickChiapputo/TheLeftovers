const MongoClient = require( 'mongodb' ).MongoClient;

const http = require( 'http' );
const url = require( 'url' );
const fs = require( 'fs' );


const hostname = 'localhost';
const port = 3004;

const server = http.createServer( ( req, res ) =>  {
	// Display date and action for debugging
	var date = new Date().toISOString().substr( 11, 8 );
	console.log( " \n \n \n(" + date  + "): Delete-Inventory Query." );

	res.statusCode = 200;									// Set 200 OK status
	res.setHeader( 'Content-Type', 'application/json' );	// Set response type as JSON
	res.setHeader( 'Access-Control-Allow-Origin', '*' );	// Allow CORS requests for local work

	var values = url.parse( req.url, true ).query;			// Get key-value parse from URL

	// Create the MONGO database URL
	const MONGO_USERNAME = 'nick';		// Username
	const MONGO_PASSWORD = '2bbjcdj7';	// Password
	const MONGO_HOSTNAME = '127.0.0.1';	// Hostname
	const MONGO_PORT = '27017';			// Port
	const MONGO_DB = 'restaurant';		// Database Name
	
	// Put the part together for the URL: 'mongodb://<username>:<password>@<hostname>:<port>/<database>?<authorisation'
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
	
	// Connect to the database
	MongoClient.connect( dburl, function( err, db ) {
	 	if( err )
	 	{
	 		res.statusCode = 500; 								// Internal Server Error
	 		res.end( JSON.stringify( { "succes" : "no" } ) );	// Unsuccessful action
	 		throw err;
	 	}

	 	// Test if name is valid
	 	if( values.name === "" || values.name === undefined )
	 	{
	 		console.log( "Name is invalid ('" + values.name + "')." );
			var returnVal = { "success" : "no" };
			res.statusCode = 400;
			res.end( JSON.stringify( returnVal ) );
			return;
	 	}
		
		// Create item with name for deletion
		var deleteItem = {};
		deleteItem[ "name" ] = values.name;

		// Display item to be deleted for debugging
		console.log( "Attempting to delete item '" + deleteItem.name + "'." );

		// Delete one item
	 	db.db( "restaurant" ).collection( "inventory" ).deleteOne( deleteItem, function( err, result ) {
	 		if( err )
	 		{
	 			res.statusCode = 500;								// Internal Server Error
	 			res.end( JSON.stringify( { "succes" : "no" } ) );	// Unsuccessful action
	 			throw err;	
	 		} 

	 		// Display deleted result for debuggin
	 		console.log( "Deleted: " + JSON.stringify( result ) );

	 		// Send deleted result back
	 		res.end( JSON.stringify( result.result ) );
	 	} );
	} );
} );

server.listen( port, hostname, () => {
	// Display start debugging
	var date = new Date().toISOString().substr( 11, 8 );
	console.log( " \n \n \n(" + date  + "): Delete-Inventory started.\n \n" );
});


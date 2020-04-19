const MongoClient = require( 'mongodb' ).MongoClient;

const http = require( 'http' );
const url = require( 'url' );
const fs = require( 'fs' );


const hostname = 'localhost';
const port = 3003;

const server = http.createServer( ( req, res ) =>  {
	// Display date and action for debugging
	var date = new Date().toISOString().substr( 11, 8 );
	console.log( " \n \n \n(" + date  + "): Create-Inventory Query." );

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

	 	// Test if count is valid
	 	if( values.count === "" || values.count === undefined || isNaN( parseInt( values.count ) ) || parseInt( values.count ) <= 0 )
	 	{
	 		console.log( "Count is invalid ('" + values.count + "')." );
			var returnVal = { "success" : "no" };
			res.statusCode = 400;
			res.end( JSON.stringify( returnVal ) );
			return;
	 	}
		
		// Create the new item from the key-value pairs
		var newItem = {};
		newItem[ "name" ] = values.name;
		newItem[ "count" ] = values.count;

		// Insert a new item
	 	db.db( "restaurant" ).collection( "inventory" ).insertOne( newItem, function( err, result ) {
	 		if( err )
	 		{
				console.log( "Unable to create new inventory item.\nError log: " + err.message );
	 			res.statusCode = 500;								// Internal Server Error
	 			res.end( JSON.stringify( { "response" : "unable to create new item" } ) );	// Unsuccessful action
	 			return;	
	 		} 

	 		// Display new item for debugging
	 		console.log( "Inserted: " + JSON.stringify( result.ops[ 0 ] ) );

	 		// Send the new item back
	 		res.end( JSON.stringify( result.ops[ 0 ] ) );
	 	} );
	} );
} );

server.listen( port, hostname, () => {
	// Display start debugging
	var date = new Date().toISOString().substr( 11, 8 );
	console.log( " \n \n \n(" + date  + "): Create-Inventory started.\n \n" );
});


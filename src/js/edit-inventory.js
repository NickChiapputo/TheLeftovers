const MongoClient = require( 'mongodb' ).MongoClient;

const http = require( 'http' );
const url = require( 'url' );
const fs = require( 'fs' );


const hostname = 'localhost';
const port = 3001;

const server = http.createServer( ( req, res ) => {
	// Display date and action for debugging
	var date = new Date().toISOString().substr( 11, 8 );
	console.log( " \n \n \n(" + date  + "): Edit-Inventory Query." );

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

	 	// Get name of item to update
		var query = {}
		query[ "name" ] = values.name;
		
		// Create object for updated item
		var updatedQuery = {};
		updatedQuery[ "name" ] = values.name;
		updatedQuery[ "count" ] = values.count;
	 	
	 	// Find and update the item
		db.db( "restaurant" ).collection( "inventory" ).findOneAndUpdate( query, { $set: updatedQuery }, { returnOriginal: false, returnNewDocument: true }, function( err, documents ) {
	 		if( err )
	 		{
	 			res.statusCode = 500;								// Internal Server Error
	 			res.end( JSON.stringify( { "succes" : "no" } ) );	// Unsuccessful action
	 			throw err;	
	 		}

	 		// Display updated item for debugging
	 		console.log( "Updated item: " + documents.value ); 
			
			// Send the updated item back
			res.end( JSON.stringify( documents.value ) );
		});
	});
} );

server.listen( port, hostname, () => {
	// Display start debugging
	var date = new Date().toISOString().substr( 11, 8 );
	console.log( " \n \n \n(" + date  + "): Edit-Inventory started.\n \n" );
} );

const MongoClient = require( 'mongodb' ).MongoClient;

const http = require( 'http' );
const url = require( 'url' );
const fs = require( 'fs' );


const hostname = 'localhost';
const port = 3002;

const server = http.createServer( ( req, res ) =>  {
	// Display date and action for debugging
	var date = new Date().toISOString().substr( 11, 8 );
	console.log( " \n \n \n(" + date  + "): Get-Inventory Query." );

	res.statusCode = 200;									// Set 200 OK status
	res.setHeader( 'Content-Type', 'application/json' );	// Set response type as JSON
	res.setHeader( 'Access-Control-Allow-Origin', '*' );	// Allow CORS requests for local work

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

	 	db.db( "restaurant" ).collection( "inventory" ).find( {} ).toArray( function( err, result ) {
	 		if( err )
	 		{
	 			res.statusCode = 500;								// Internal Server Error
	 			res.end( JSON.stringify( { "succes" : "no" } ) );	// Unsuccessful action
	 			throw err;	
	 		} 

	 		// Display result to log file
			console.log( "Found: " + JSON.stringify( result ) + " \n \n" );		

			// Send JSON string back
	 		res.end( JSON.stringify( result ) );
	 	});
	});
} );

server.listen( port, hostname, () => {
	// Display start debugging
	var date = new Date().toISOString().substr( 11, 8 );
	console.log( " \n \n \n(" + date  + "): Get-Inventory started.\n \n" );
});


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

		// Stringified JSON of updated item
		let body = '';

		// Asynchronous. Keep appending data until all data is read
		req.on( 'data', ( chunk ) => { body += chunk } );

		// Data is finished being read. Edit item
		req.on( 'end', () => {
			// Parse JSON string into obj
			var obj = JSON.parse( body );

		 	// Test if name is valid
		 	if( obj.name === "" || obj.name === undefined )
		 	{
		 		console.log( "Name is invalid ('" + obj.name + "')." );
				var returnVal = { "success" : "no" };
				res.statusCode = 400;
				res.end( JSON.stringify( returnVal ) );
				return;
		 	}

		 	// Test if count is valid
		 	if( obj.count === "" || obj.count === undefined || isNaN( parseInt( obj.count ) ) || parseInt( obj.count ) <= 0 )
		 	{
		 		console.log( "Count is invalid ('" + obj.count + "')." );
				var returnVal = { "success" : "no" };
				res.statusCode = 400;
				res.end( JSON.stringify( returnVal ) );
				return;
		 	}

			// Create object with original name
			var query = {}
			query[ "name" ] = obj.name;

			// Create updated item with updated count
			var updatedQuery = {}
			updatedQuery[ "name" ] = obj.name;
			updatedQuery[ "count" ] = obj.count;

			// Display update for debugging
			console.log( "Attempting to update item to:\n  Name: " + updatedQuery.name + "\n  Count: " + updatedQuery.count );

	 		// Find and update the item
			db.db( "restaurant" ).collection( "inventory" ).findOneAndUpdate( query, { $set: updatedQuery }, { returnOriginal: false, returnNewDocument: true }, function( err, documents ) {
	 			if( err )
	 			{
	 				res.statusCode = 500;								// Internal Server Error
	 				res.end( JSON.stringify( { "succes" : "no" } ) );	// Unsuccessful action
	 				throw err;	
	 			}
		
				// Display updated item for debugging
		 		console.log( "Updated item: " + JSON.stringify( documents.value ) ); 
		
				// Send the updated item back
				res.end( JSON.stringify( documents.value ) );
			});
		} );
	});
} );

server.listen( port, hostname, () => {
	// Display start debugging
	var date = new Date().toISOString().substr( 11, 8 );
	console.log( " \n \n \n(" + date  + "): Edit-Inventory started.\n \n" );
} );

const MongoClient = require( 'mongodb' ).MongoClient;

const http = require( 'http' );
const url = require( 'url' );
const fs = require( 'fs' );


const hostname = 'localhost';
const port = 3000;

const server = http.createServer( ( req, res ) =>  {
	// Display date and action for debugging
	var date = new Date().toISOString().substr( 11, 8 );
	console.log( " \n \n \n(" + date  + "): Test Query." );

	res.statusCode = 200;									// Set 200 OK status
	res.setHeader( 'Content-Type', 'application/json' );	// Set response type as JSON
	res.setHeader( 'Access-Control-Allow-Origin', '*' );	// Allow CORS requests for local work

	// Stringified JSON of updated item
	let body = '';

	// Asynchronous. Keep appending data until all data is read
	req.on( 'data', ( chunk ) => { body += chunk } );

	// Data is finished being read. Edit item
	req.on( 'end', () => { console.log( "Received: " + body ); res.end( body ); } );
});



server.listen( port, hostname, () => {
	// Display start debugging
	var date = new Date().toISOString().substr( 11, 8 );
	console.log( " \n \n \n(" + date  + "): Get-Inventory started.\n \n" );
});

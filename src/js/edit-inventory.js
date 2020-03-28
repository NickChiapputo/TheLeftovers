const http = require( 'http' );
const url = require( 'url' );
const fs = require( 'fs' );

const hostname = 'localhost';
const port = 3001;

const server = http.createServer( ( req, res ) => {
	res.statusCode = 200;
	res.setHeader( 'Content-Type', 'text/plain' );

	var query = url.parse( req.url, true ).query;
	res.end( "Parameters we received: " + JSON.stringify( query ) + "\nURL we received: " + req.url );
} );

server.listen( port, hostname, () => {
	console.log( `Server running at http://${hostname}:${port}/` );
} );
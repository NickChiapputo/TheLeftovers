#!/usr/bin/env nodejs

const http = require( 'http' );
const url = require( 'url' );
const fs = require( 'fs' );

const hostname = 'localhost';
const port = 3000;

const server = http.createServer( ( req, res ) => {
	res.statusCode = 200;
	// res.setHeader( 'Content-Type', 'text/plain' );
	res.setHeader( 'Content-Type', 'application/json' );

	var obj;

	obj = JSON.parse( fs.readFileSync( 'data/inventory.json', 'utf8' ) );

	res.end( JSON.stringify( obj ) );
	
	// res.end( 'Hello World!\n' + req.url + '\n' );
});

server.listen( port, hostname, () => {
	console.log( `Server running at http://${hostname}:${port}/` );
});

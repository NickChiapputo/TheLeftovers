const MongoClient = require( 'mongodb' ).MongoClient;

const http = require( 'http' );
const url = require( 'url' );
const fs = require( 'fs' );


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

const hostname = 'localhost';
const port = 3001;

const server = http.createServer( ( req, res ) => {
	res.statusCode = 200;
	res.setHeader( 'Content-Type', 'application/json' );

	var values = url.parse( req.url, true ).query;

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
	
	MongoClient.connect( dburl, function( err, db ) {
	 	if( err ) throw err;

	 	var dbo = db.db( "restaurant" );

		var query = {}
		query[ "name" ] = values.name;
		
		var updatedQuery = {};
		updatedQuery[ "name" ] = values.name;
		updatedQuery[ "count" ] = values.count;
	 	
		dbo.collection( "inventory" ).findOneAndUpdate( query, { $set: updatedQuery }, { returnOriginal: false, returnNewDocument: true }, function( err, documents ) {
			if( err ) throw err;
			
			res.end( JSON.stringify( documents.value ) );
		});
		
		// dbo.collection( "inventory" ).find( query ).toArray( function( err, result ) {
	 	// 	if( err ) throw err;
			// console.log( "We found: " + JSON.stringify( result ) );		
	 	// 	res.end( "We found: " + JSON.stringify( result ) + " when searching by the name " + values.name );
	 	// });
	});

	// res.end( "Parameters we received: " + JSON.stringify( query ) + "\nURL we received: " + req.url );
} );

server.listen( port, hostname, () => {
	console.log( `Server running at http://${hostname}:${port}/` );
} );

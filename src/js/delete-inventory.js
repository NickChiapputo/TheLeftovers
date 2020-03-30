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
const port = 3004;

const server = http.createServer( ( req, res ) =>  {
 	console.log( "Server created." );
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
		
		var deleteItem = {};
		deleteItem[ "name" ] = values.name;

	 	dbo.collection( "inventory" ).deleteOne( deleteItem, function( err, result ) {
	 		if( err ) throw err;

	 		console.log( "Deleted: " + JSON.stringify( result ) );
	 		res.end( JSON.stringify( result.result ) );
	 	} );
	} );
} );

server.listen( port, hostname, () => {
	console.log( "Mongodb Server Listening.\n" );
});

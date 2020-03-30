const MongoClient = require( 'mongodb' ).MongoClient;

const http = require( 'http' );
const url = require( 'url' );
const fs = require( 'fs' );


const hostname = 'localhost';
const port = 3002;

const server = http.createServer( ( req, res ) =>  {
 	console.log( "Server created." );
	res.statusCode = 200;
	res.setHeader( 'Content-Type', 'application/json' );
	res.setHeader( 'Access-Control-Allow-Origin', '*' );

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
	 	dbo.collection( "inventory" ).find( {} ).toArray( function( err, result ) {
	 		if( err ) throw err;
			console.log( "Found: " + JSON.stringify( result ) );		
	 		res.end( JSON.stringify( result ) );
	 	});
	});
} );

server.listen( port, hostname, () => {
	console.log( "Mongodb Server Listening.\n" );
});


const MongoClient = require( 'mongodb' ).MongoClient;

const http = require( 'http' );
const url = require( 'url' );
const fs = require( 'fs' );


const hostname = 'localhost';
const port = 3001;

const server = http.createServer( ( req, res ) => {
	res.statusCode = 200;
	res.setHeader( 'Content-Type', 'application/json' );
	res.setHeader( 'Access-Control-Allow-Origin', '*' );

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
	});
} );

server.listen( port, hostname, () => {
	console.log( `Server running at http://${hostname}:${port}/` );
} );

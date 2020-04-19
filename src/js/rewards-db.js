const MongoClient = require( 'mongodb' ).MongoClient;

const http = require( 'http' );
const url = require( 'url' );
const fs = require( 'fs' );
const formidable = require( 'formidable' );

const hostname = 'localhost';
const port = 3006;

const server = http.createServer( ( req, res ) =>  {
	// Display date and action for debugging
	var date = new Date().toISOString().substr( 11, 8 );
	console.log( " \n \n \n(" + date  + "): Rewards Accounts Query." );


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

	// Get URL path
	var url_parts = url.parse( req.url, true );
	var path  = url_parts.pathname;
	var query = url_parts.query;

	MongoClient.connect( dburl, function( err, db ) {
	 	if( err ) 
	 	{
	 		console.log( "Error connecting to MongoDB." );
	 		res.statusCode = 500;
	 		res.end( JSON.stringify( { "success" : "no" } ) );
	 		throw err;
	 		return;
	 	}

	 	// Select restaurant database and menu-items collection
	 	var collection = db.db( "restaurant" ).collection( "rewards" );

	 	if( path == "/rewards/view" )
	 	{
	 		viewRewardsAccount( collection, res );
	 	}
	 	else if( path == "/rewards/create" )
	 	{
	 		// Stringified JSON of new account values
	 		let body = '';

	 		// Asynchronous. Keep appending data until all data is read
	 		req.on( 'data', ( chunk ) => { body += chunk; } );

	 		// Data is finished being read. edit item
	 		req.on( 'end', () => { 
	 			var obj = JSON.parse( body );

	 			// Check if data is valid
	 			if( obj.phone === "" || obj.phone === undefined || obj.phone.length != 10 )
	 			{
			 		console.log( "Phone number is invalid ('" + obj.phone + "')." );
					var returnVal = { "success" : "no" };
					res.statusCode = 400;
					res.end( JSON.stringify( returnVal ) );
					return;
	 			}

			 	// Test if name is valid
			 	if( obj.name === "" || obj.name === undefined )
			 	{
			 		console.log( "Name is invalid ('" + obj.name + "')." );
					var returnVal = { "success" : "no" };
					res.statusCode = 400;
					res.end( JSON.stringify( returnVal ) );
					return;
			 	}

			 	var newAccount = { "lastMeal" : null };
			 	newAccount[ "_id" ] = obj.phone;
			 	newAccount[ "name" ] = obj.name;

	 			createNewAccount( newAccount, collection, res );
	 		});
	 	}
	 	else if( path == "/rewards/delete" )
	 	{
	 		// Stringified JSON of new account values
	 		let body = '';

	 		// Asynchronous. Keep appending data until all data is read
	 		req.on( 'data', ( chunk ) => { body += chunk; } );

	 		// Data is finished being read. edit item
	 		req.on( 'end', () => {
				console.log( "Received: " + body );
	 			var obj = JSON.parse( body );

	 			// Check if data is valid
	 			if( obj.phone === "" || obj.phone === undefined || obj.phone.length != 10 )
	 			{
			 		console.log( "Phone number is invalid ('" + obj.phone + "')." );
					var returnVal = { "success" : "no" };
					res.statusCode = 400;
					res.end( JSON.stringify( returnVal ) );
					return;
	 			}

			 	var deleteItem = {};
			 	deleteItem[ "_id" ] = obj.phone;

	 			deleteAccount( deleteItem, collection, res );
	 		});
	 	}
	 	else if( path == "/rewards/search" )
	 	{
	 		// Stringified JSON of new account values
	 		let body = '';

	 		// Asynchronous. Keep appending data until all data is read
	 		req.on( 'data', ( chunk ) => { body += chunk; } );

	 		// Data is finished being read. edit item
	 		req.on( 'end', () => { 
	 			console.log( "Searching for " + body );

	 			var obj = JSON.parse( body );

	 			// Check if data is valid
	 			if( obj[ "phone" ] === "" || obj[ "phone" ] === undefined || obj[ "phone" ].length != 10 )
	 			{
			 		console.log( "Phone number is invalid ('" + obj.phone + "')." );
					res.statusCode = 400;
					res.end( JSON.stringify( { "success" : "no" } ) );
					return;
	 			}

			 	var account = {};
			 	account[ "_id" ] = obj[ "phone" ];

	 			getRewardsAccount( account, collection, res );
	 		});
	 	}
	 	else
	 	{
			console.log( "Invalid path: '" + path + "'.\n\n" );
	 		res.statusCode = 500;
	 		res.end( JSON.stringify( { "success" : "no" } ) );
	 		return;
	 	}
	 });
});



server.listen( port, hostname, () => {
	// Display time to log for debugging
	var date = new Date().toISOString().substr( 11, 8 );
	console.log(  "(" + date + "): " ); 
});

function viewRewardsAccount( collection, res )
{
	collection.find( {} ).toArray( function( err, result ) {
		if( err )
		{
			console.log( "Error querying account list." );
			res.statusCode = 500;								// Internal Server Error
			res.end( JSON.stringify( { "success" : "no" } ) );	// Unsuccessful action
			throw err;
		}

		console.log( 	"Items found in rewards accounts database:\n" +
						JSON.stringify( result ) +
						"\n\n" );

		// Send list of items back
		res.end( JSON.stringify( result ) );
	} );
}

function createNewAccount( newAccount, collection, res )
{
	collection.insertOne( newAccount, function( err, result ) {
 		if( err )
 		{
 			console.log( "Error inserting.\nError log: " + err.message );
 			res.statusCode = 500;								// Internal Server Error
 			res.end( JSON.stringify( { "succes" : "no" } ) );	// Unsuccessful action
 			return;
		} 

 		// Display new item for debugging
 		console.log( "Inserted: " + JSON.stringify( result.ops[ 0 ] ) );

 		// Send the new item back
 		res.end( JSON.stringify( result.ops[ 0 ] ) );
 	} );
}

function deleteAccount( deleteItem, collection, res )
{
	collection.deleteOne( deleteItem, function( err, result ) {
		if( err )
		{
			console.log( "Error deleting account." );
			res.statusCode = 500;								// Internal Server Error
			res.end( JSON.stringify( { "success" : "no" } ) );	// Unsuccessful action
			throw err;
		}

 		// Display deleted result for debuggin
 		console.log( "Deleted: " + JSON.stringify( result ) );

 		// Send deleted result back
 		res.end( JSON.stringify( result.result ) );
	} );
}

function getRewardsAccount( id, collection, res )
{
	collection.findOne( id, function( err, result ) {
		if( err )
		{
			console.log( "Error finding account." );
			res.statusCode = 500;								// Internal Server Error
			res.end( JSON.stringify( { "success" : "no" } ) );	// Unsuccessful action
			throw err;
		}

		if( result === null )
		{
			console.log( "Unable to find rewards account '" + id[ "_id" ] + "'." );

			res.statusCode = 400;
			res.end( JSON.stringify( { "response" : "did not find account" } ) );
			return;
		}

		console.log( 	"Item found in rewards accounts database:\n" + JSON.stringify( result ) + "\n\n" );

		// Send item back
		res.end( JSON.stringify( result ) );
	});
}

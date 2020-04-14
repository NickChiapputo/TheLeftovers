const MongoClient = require( 'mongodb' ).MongoClient;
const mongo = require( 'mongodb' );

const http = require( 'http' );
const url = require( 'url' );
const fs = require( 'fs' );
const formidable = require( 'formidable' );
const nodemailer = require( 'nodemailer' );

const hostname = 'localhost';
const port = 3008;

const server = http.createServer( ( req, res ) =>  {
	// Display date and action for debugging
	var date = new Date().toISOString().substr( 11, 8 );
	console.log( " \n \n \n(" + date  + "): Tables Query." );


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
	 	var collection = db.db( "restaurant" ).collection( "tables" );

	 	if( path == "/tables/view" )
	 	{
	 		viewTables( collection, res );
	 	}
	 	else if( path == "/tables/create" )
	 	{
	 		// Stringified JSON of new account values
	 		let body = '';

	 		// Asynchronous. Keep appending data until all data is read
	 		req.on( 'data', ( chunk ) => { body += chunk; } );

	 		// Data is finished being read. edit item
	 		req.on( 'end', () => { 
				console.log( "Received: \n" + body + "\n" ); 

				var obj = JSON.parse( body );

				// Check that value is valid
				if( obj[ "table" ] === undefined || obj[ "table" ] === "" || isNaN( parseInt( obj[ "table" ] ) ) || parseInt( obj[ "table" ] ) > 20 || parseInt( obj[ "table" ] ) < 1 )
				{
					console.log( "Bad table value: '" + obj[ "table" ] + "'." );

					res.statusCode = 400;
					res.end( JSON.stringify( { "response" : "bad table number format" } ) );
					return;
				}

				var table = {};
				table[ "table" ] = parseInt( obj[ "table" ] );

				createTable( table, collection, res ); 
			});
	 	}
	 	else if( path == "/tables/delete" )
	 	{
	 		// Stringified JSON of new account values
	 		let body = '';

	 		// Asynchronous. Keep appending data until all data is read
	 		req.on( 'data', ( chunk ) => { body += chunk; } );

	 		// Data is finished being read. Delete item
	 		req.on( 'end', () => { 
				console.log( "Received: \n" + body + "\n" ); 

				var obj = JSON.parse( body );
				var table = {};
				table[ "table" ] = obj[ "table" ];

				// Check that value is valid
				if( table[ "table" ] === undefined || table[ "table" ] === "" || isNaN( parseInt( table[ "table" ] ) ) || parseInt( table[ "table" ] ) > 20 || parseInt( table[ "table" ] ) < 1 )
				{
					res.statusCode = 400;
					res.end( JSON.stringify( { "response" : "bad table number format" } ) );
					return;
				}

				deleteOrder( table, collection, res ); 
			});
		}
		else if( path == "/tables/update" )
		{
	 		// Stringified JSON of new account values
	 		let body = '';

	 		// Asynchronous. Keep appending data until all data is read
	 		req.on( 'data', ( chunk ) => { body += chunk; } );

	 		// Data is finished being read. Update table status
	 		req.on( 'end', () => {
	 			console.log( "Received: \n" + body + "\n" );

	 			var obj = JSON.parse( body );

	 			// Check that status field is valid
	 			if( obj[ "status" ] === undefined || ( obj[ "status" ] !== "sitting" && obj[ "status" ] !== "ordered" && obj[ "status" ] !== "eating" && obj[ "status" ] !== "paid" ) )
	 			{
					res.statusCode = 400;
					res.end( JSON.stringify( { "response" : "bad table status format" } ) );
					return;
	 			}

	 			// Check that table number is valid
				if( obj[ "table" ] === undefined || obj[ "table" ] === "" || isNaN( parseInt( obj[ "table" ] ) ) || parseInt( obj[ "table" ] ) > 20 || parseInt( obj[ "table" ] ) < 1 )
				{
					res.statusCode = 400;
					res.end( JSON.stringify( { "response" : "bad table number format" } ) );
					return;
				}

	 			// Ensure JSON object only has status field
	 			var table = {}
	 			table[ "status" ] = obj[ "status" ];

	 			// Get JSON object that only has table number
	 			var tableNum = {};
	 			tableNum[ "table" ] = obj[ "table" ];

	 			// Update status
	 			updateTableStatus( tableNum, table, collection, res );
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

function viewTables( collection, res )
{
	collection.find( {} ).toArray( function( err, result ) {
 		if( err )
 		{
 			console.log( "Error querying database." );
 			res.statusCode = 500;														// Internal Server Error
 			res.end( JSON.stringify( { "response" : "error querying database" } ) );	// Unsuccessful action
 			throw err;	
 		} 

		console.log( 	"Items found in tables database:\n" +
						JSON.stringify( result ) +
						"\n\n" );

		// Send list of items back
		res.end( JSON.stringify( result ) );
	} );
}

function createTable( table, collection, res )
{
	// Set default status to sitting
	table[ "status" ] = "sitting";

	collection.insertOne( table, function( err, result ) {
 		if( err )
 		{
 			console.log( "Error inserting table." );
 			res.statusCode = 500;													// Internal Server Error
 			res.end( JSON.stringify( { "response" : "error inserting table" } ) );	// Unsuccessful action
 			throw err;	
 		} 

 		// Display new item for debugging
 		console.log( "Inserted Table: " + JSON.stringify( result.ops[ 0 ] ) );

 		// Send the new item back
 		res.end( JSON.stringify( result.ops[ 0 ] ) );
 	} );
}

function updateTableStatus( table, updatedQuery, collection, res )
{
	console.log( "Table: " + JSON.stringify( table ) );
	console.log( "Updated Query: " + JSON.stringify( updatedQuery ) );
	// Find and update the item
	collection.findOneAndUpdate( table, { $set : updatedQuery }, { returnOriginal : false, returnNewDocument : true }, function( err, result ) {
		if( err )
		{
			console.log( "Unable to find and update table status." );
	 		res.statusCode = 500;																		// Internal Server Error
	 		res.end( JSON.stringify( { "response" : "Unable to find and update table status." } ) );	// Give error response to client
	 		throw err;
			return;
		}
		
		// Display updated table for debugging
 		console.log( "Updated item: " + JSON.stringify( result.value ) ); 

		// Send the updated table back
		res.end( JSON.stringify( result.value ) );
	});
}

function deleteTable( deleteItem, collection, res )
{
	console.log( "Attempting to delete table: " + JSON.stringify( deleteItem ) );

	collection.deleteOne( deleteItem, function( err, result ) {
		if( err )
		{
			console.log( "Error deleting table." );
			res.statusCode = 500;													// Internal Server Error
			res.end( JSON.stringify( { "response" : "error deleting table" } ) );	// Unsuccessful action
			throw err;
		}

 		// Display deleted result for debugging
 		console.log( "Deleted Table: " + JSON.stringify( result ) );

 		// Send deleted result back
 		res.end( JSON.stringify( result.result ) );
	} );
}


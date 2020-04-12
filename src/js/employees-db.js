const MongoClient = require( 'mongodb' ).MongoClient;
const mongo = require( 'mongodb' );

const http = require( 'http' );
const url = require( 'url' );
const fs = require( 'fs' );
const formidable = require( 'formidable' );
const nodemailer = require( 'nodemailer' );

const hostname = 'localhost';
const port = 3009;

const server = http.createServer( ( req, res ) =>  {
	// Display date and action for debugging
	var date = new Date().toISOString().substr( 11, 8 );
	console.log( " \n \n \n(" + date  + "): Employees Query." );


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
	 	var collection = db.db( "restaurant" ).collection( "employees" );

	 	if( path == "/employees/view" )
	 	{
	 		viewEmployees( collection, res );
	 	}
	 	else if( path == "/employees/create" )
	 	{
	 		// Stringified JSON of new account values
	 		let body = '';

	 		// Asynchronous. Keep appending data until all data is read
	 		req.on( 'data', ( chunk ) => { body += chunk; } );

	 		// Data is finished being read. edit item
	 		req.on( 'end', () => { 
				console.log( "Received: \n" + body + "\n" ); 

				// Get JSON object of input data
				var obj = JSON.parse( body );

				// Check if first is valid 
				if( obj[ "first" ] === undefined || obj[ "first" ] === "" )
				{
					console.log( "Invalid first name: '" + obj[ "first" ] + "'." );

					res.statusCode = 400;
					res.end( JSON.stringify( { "response" : "invalid first name" } ) );
					return;
				}

				// Check if last is valid
				if( obj[ "last" ] === undefined || obj[ "last" ] === "" )
				{
					cosole.log( "Invalid last name: '" + obj[ "last" ] + "'." );

					res.statusCode = 400;
					res.end( JSON.stringify( { "response" : "invalid last name" } ) );
					return;
				}

				// Check if type is valid
				if( obj[ "type" ] === undefined || obj[ "type" ] === "" ||
					( obj[ "type" ] !== "server" && obj[ "type" ] !== "manager" ) )
				{
					cosole.log( "Invalid type: '" + obj[ "type" ] + "'." );

					res.statusCode = 400;
					res.end( JSON.stringify( { "response" : "invalid type" } ) );
					return;
				}

				// Create JSON object of new employee
				var employee = {};
				employee[ "first" ] = obj[ "first" ];

				// Only add middle name if it exists
				if( obj[ "middle" ] !== undefined & obj[ "middle" ] !== "" )
					employee[ "middle" ] = obj[  "middle" ];

				employee[ "last" ] = obj[ "last" ];

				// Generate random four digit pin
				var pin = Math.floor( 10000 + Math.random() * 10000 ).toString().substring( 1 );
				employee[ "pin" ] = pin;

				employee[ "type" ] = obj[ "type" ];

				employee[ "shifts" ] = [];
				employee[ "tips" ] = [];
				employee[ "comps" ] = [];

				console.log( "Employee to create: " + JSON.stringify( employee ) );

				createEmployee( employee, collection, res ); 
			});
	 	}
	 	else if( path == "/employees/delete" )
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
		else if( path == "/employees/login" )
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
	 			if( obj[ "_id" ] === undefined || obj[ "_id" ] === ""  )
	 			{
					console.log( "Invalid _id value '" + obj[ "_id" ] + "'." );

					res.statusCode = 200;
					res.end( JSON.stringify( { "success" : "no" } ) );
					return;
	 			}

				// Check that pin is valid
	 			if( obj[ "pin" ] === undefined || obj[ "pin" ] === ""  )
	 			{
					console.log( "Invalid pin value '" + obj[ "pin" ] + "'." );

					res.statusCode = 200;
					res.end( JSON.stringify( { "success" : "no" } ) );
					return;
	 			}


	 			// Ensure JSON object only has _id and pin fields
	 			var employee = {}
	 			employee[ "_id" ] = new mongo.ObjectId( obj[ "_id" ] );
				employee[ "pin" ] = obj[ "pin" ];

	 			// Update status
	 			findEmployee( employee, collection, res );
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

function viewEmployees( collection, res )
{
	collection.find( {} ).toArray( function( err, result ) {
 		if( err )
 		{
 			console.log( "Error querying database." );
 			res.statusCode = 500;														// Internal Server Error
 			res.end( JSON.stringify( { "response" : "error querying database" } ) );	// Unsuccessful action
 			throw err;	
 		} 

		console.log( 	"Items found in employee database:\n" +
						JSON.stringify( result ) +
						"\n\n" );

		// Send list of items back
		res.end( JSON.stringify( result ) );
	} );
}

function createEmployee( employee, collection, res )
{
	collection.insertOne( employee, function( err, result ) {
 		if( err )
 		{
 			console.log( "Error inserting employee." );
 			res.statusCode = 500;														// Internal Server Error
 			res.end( JSON.stringify( { "response" : "error inserting employee" } ) );	// Unsuccessful action
 			throw err;	
 		} 

 		// Display new item for debugging
 		console.log( "Inserted Employee: " + JSON.stringify( result.ops[ 0 ] ) );

 		// Send the new item back
 		res.end( JSON.stringify( result.ops[ 0 ] ) );
 	} );
}

function findEmployee( employee, collection, res )
{
	console.log( "Employee attempting login:\n    _id: " + employee[ "_id" ] + "\n    pin: " + employee[ "pin" ] + "\n" );

	// Find and update the item
	collection.findOne( employee, function( err, result ) {
		if( err )
		{
			console.log( "Unable to find and update table status." );
	 		res.statusCode = 500;																		// Internal Server Error
	 		res.end( JSON.stringify( { "response" : "Unable to find and update table status." } ) );	// Give error response to client
	 		throw err;
			return;
		}

		if( result == null )
		{
			res.statusCode = 200;
			res.end( JSON.stringify( { "success" : "no" } ) );
			return;
		}
		
		// Display updated table for debugging
 		console.log( "Successful login: " + JSON.stringify( result.value ) ); 

		// Send the updated table back
		res.end( JSON.stringify( { "success" : "yes" } ) );
	});
}

function deleteEmployee( deleteItem, collection, res )
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


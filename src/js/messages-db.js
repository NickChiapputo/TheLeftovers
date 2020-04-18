const MongoClient = require( 'mongodb' ).MongoClient;
const mongo = require( 'mongodb' );

const http = require( 'http' );
const url = require( 'url' );
const fs = require( 'fs' );
const formidable = require( 'formidable' );
const nodemailer = require( 'nodemailer' );

const hostname = 'localhost';
const port = 3012;

const server = http.createServer( ( req, res ) =>  {
	// Display date and action for debugging
	var date = new Date().toISOString().substr( 11, 8 );
	console.log( " \n \n \n(" + date  + "): Messages Query." );


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
	 	var collection = db.db( "restaurant" ).collection( "messages" );

	 	if( path == "/messages/get" )	// Look for messages that were sent to a given identifier
	 	{
	 		// Stringified JSON of new account values
	 		let body = '';

	 		// Asynchronous. Keep appending data until all data is read
	 		req.on( 'data', ( chunk ) => { body += chunk; } );

	 		// Data is finished being read. Get messages
	 		req.on( 'end', () => { 
				console.log( "Get Message Data Received: \n" + body + "\n" ); 

				var obj = JSON.parse( body );

				// Test if destType field is valid
				if( obj[ "destType" ] === undefined || obj[ "destType" ] === "" ||
					( obj[ "destType" ] !== "server" && obj[ "destType" ] !== "manager" ) )
				{
					console.log( "Invalid destType '" + obj[ "destType" ] + "'." );

					res.statusCode = 400;
					res.end( JSON.stringify( { "response" : "invalid destType" } ) );
					return;
				}

				// Check that identifier is valid
				if( ( obj[ "destType" ] === "server" || obj[ "destType" ] === "manager" ) &&
					( obj[ "dest" ] === undefined || obj[ "dest" ] === "" || !( /^[0-9a-fA-F]{24}$/.test( obj[ "dest" ] ) ) ) )
				{
					console.log( "Invalid dest '" + obj[ "dest" ] + "'." );

					res.statusCode = 400;
					res.end( JSON.stringify( { "response" : "invalid dest" } ) );
					return;
				}

				// Create object to search with using identifiers
				var query = {};
				query[ "dest" ] = obj[ "dest" ];
				query[ "destType" ] = obj[ "destType" ];

				// Return relevant messges
				getMessages( query, collection, res );
			});
	 	}
	 	else if( path == "/messages/send" )
	 	{
	 		// Stringified JSON of new account values
	 		let body = '';

	 		// Asynchronous. Keep appending data until all data is read
	 		req.on( 'data', ( chunk ) => { body += chunk; } );

	 		// Data is finished being read. Send message
	 		req.on( 'end', () => { 
				console.log( "Send Message Data Received: \n" + body + "\n" ); 

				var obj = JSON.parse( body );

				// Test if type field is valid
				if( obj[ "srcType" ] === undefined || obj[ "srcType" ] === "" ||
					( obj[ "srcType" ] !== "server" && obj[ "srcType" ] !== "kitchen" && obj[ "srcType" ] !== "table" ) )
				{
					console.log( "Invalid srcType '" + obj[ "srcType" ] + "'." );

					res.statusCode = 400;
					res.end( JSON.stringify( { "response" : "invalid srcType" } ) );
					return;
				}

				// Check that applicable identifiers are valid
				if( ( obj[ "srcType" ] === "server" ) &&
					( obj[ "src" ] === undefined || obj[ "src" ] === "" || !( /^[0-9a-fA-F]{24}$/.test( obj[ "src" ] ) ) ) )
				{
					console.log( "Invalid src '" + obj[ "src" ] + "'." );

					res.statusCode = 400;
					res.end( JSON.stringify( { "response" : "invalid src" } ) );
					return;
				}
				else if( obj[ "srcType" ] === "table" && 
						( obj[ "src" ] === undefined || obj[ "src" ] === "" || !(/[0-9]{1,2}/.test( obj[ "src" ] ) ) || isNaN( parseInt( obj[ "src" ] ) ) || parseInt( obj[ "src" ] ) < 1 || parseInt( obj[ "src" ] ) > 20 ) )
				{
					console.log( "Invalid table src '" + obj[ "src" ] + "'." );

					res.statusCode = 400;
					res.end( JSON.stringify( { "response" : "invalid table src" } ) );
					return;
				}

				// Test if destType field is valid
				if( obj[ "destType" ] === undefined || obj[ "destType" ] === "" ||
					( obj[ "destType" ] !== "server" && obj[ "destType" ] !== "manager" ) )
				{
					console.log( "Invalid destType '" + obj[ "destType" ] + "'." );

					res.statusCode = 400;
					res.end( JSON.stringify( { "response" : "invalid destType" } ) );
					return;
				}

				// Check that identifier is valid
				if( ( obj[ "destType" ] === "server" || obj[ "destType" ] === "manager" ) &&
					( obj[ "dest" ] === undefined || obj[ "dest" ] === "" || !( /^[0-9a-fA-F]{24}$/.test( obj[ "dest" ] ) ) ) )
				{
					console.log( "Invalid dest '" + obj[ "dest" ] + "'." );

					res.statusCode = 400;
					res.end( JSON.stringify( { "response" : "invalid dest" } ) );
					return;
				}

				// Check that request is valid
				if( obj[ "request" ] === undefined || obj[ "request" ] === "" )
				{
					console.log( "Invalid request '" + obj[ "request" ] + "'." );

					res.statusCode = 400;
					res.end( JSON.stringify( { "response" : "empty request" } ) );
					return;
				}

				// Create object to search with using identifiers
				var message = {};

				// Empty identifier for kitchen
				if( obj[ "type" ] === "kitchen" )
					message[ "src" ] = "";
				else
					message[ "src" ] = obj[ "src" ];

				message[ "srcType" ] = obj[ "srcType" ];
				message[ "dest" ] = obj[ "dest" ];
				message[ "destType" ] = obj[ "destType" ];
				message[ "request" ] = obj[ "request" ];

				// Return relevant messges
				sendMessage( message, collection, res );
			});
	 	}
	 	else
	 	{
			console.log( "Invalid path: '" + path + "'.\n\n" );
	 		res.statusCode = 500;

			var response = {};
			response[ "response" ] = "bad path - '" + path + "'";

	 		res.end( JSON.stringify( response ) );
	 		return;
	 	}
	});
});

server.listen( port, hostname, () => {
	// Display time to log for debugging
	var date = new Date().toISOString().substr( 11, 8 );
	console.log(  "(" + date + "): " ); 
});

async function getMessages( query, collection, res )
{
	var messageList;

	try
	{
		messageList = await searchMessages( query, collection );
	
		// Check if message list is null
		if( messageList === null )
		{
			console.log( "No messages found." );
	
			res.statusCode = 500;
			res.end( JSON.stringify( { "response" : "no messages found" } ) );
			return;
		}
		
		// Delete messages
		var deleteReturn = await deleteMessages( query, collection );
		console.log( "Message Delete Return: " + JSON.stringify( deleteReturn ) );
	}
	catch( e )
	{
		console.log( "Fatal error searching messages.\nError log: " + e.message );

		res.statusCode = 500;
		res.end( JSON.stringify( { "response" : "fatal error searching messages" } ) );
		return;
	}


	// Messages were found
	console.log( "Messages found for user " + query[ "destType" ] + " - '" + query[ "dest" ] + "':\n" + JSON.stringify( messageList ) );
	res.end( JSON.stringify( messageList ) );
}

async function searchMessages( query, collection )
{
	return collection.find( query ).toArray();
}

async function deleteMessages( query, collection )
{
	return collection.deleteMany( query )
}

async function sendMessage( message, collection, res )
{
	var sendResponse;

	try
	{
		sendResponse = await insertMessage( message, collection );
	}
	catch( e )
	{
		console.log( "Fatal error inserting message.\nError log: " + e.message );

		res.statusCode = 500;
		res.end( JSON.stringify( { "response" : "fatal error inserting message" } ) );
		return;
	}

	// Message was inserted
	console.log( "Message inserted:\n" + JSON.stringify( sendResponse.ops[ 0 ] ) );
	res.end( JSON.stringify( sendResponse.ops[ 0 ] ) );
}

async function insertMessage( message, collection )
{
	return collection.insertOne( message, collection );
}

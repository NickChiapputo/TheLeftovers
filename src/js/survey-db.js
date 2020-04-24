const MongoClient = require( 'mongodb' ).MongoClient;

const http = require( 'http' );
const url = require( 'url' );
const fs = require( 'fs' );
const formidable = require( 'formidable' );

const hostname = 'localhost';
const port = 3013;

const server = http.createServer( ( req, res ) =>  {
	// Display date and action for debugging
	var date = new Date().toISOString().substr( 11, 8 );
	console.log( " \n \n \n(" + date  + "):" );


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
	 	var collection = db.db( "restaurant" ).collection( "survey" );

	 	if( path == "/feedback/view" )
	 	{
	 		getResponses( collection, res );
	 	}
	 	else if( path == "/feedback/submit" )
	 	{
	 		console.log( "Submitting new feedback." );

	 		// Stringified JSON of new account values
	 		let body = '';

	 		// Asynchronous. Keep appending data until all data is read
	 		req.on( 'data', ( chunk ) => { body += chunk; } );

	 		// Data is finished being read. edit item
	 		req.on( 'end', () => { 
	 			console.log( "\nInput: " + body );
					
				var obj;

	 			try
	 			{
	 				obj = JSON.parse( body );
	 			}
	 			catch( e )
	 			{
	 				console.log( "Unable to parse JSON of '" + body + "'.\nError log: " + e.message );
	 				res.statusCode = 400;
	 				res.end( JSON.stringify( { "response" : "bad JSON" } ) );
	 				return;
	 			}
				
				var feedback = {};
				for( attr in obj )
				{
					if( obj[ attr ] !== undefined && obj[ attr ] !== null && 
						obj[ attr ] !== "" && obj[ attr ] !== "N/A" )
					{
						feedback[ attr ] = obj[ attr ];
					}
				}

				updateFeedbackResponse( collection, feedback, res );
	 		});
	 	}
	 	else if( path == "/feedback/search" )
	 	{
	 		console.log( "Searching for feedback." );
	 		res.statusCode = 501;
	 		res.end( JSON.stringify( { "response" : "not implemented!" } ) );
	 		return;

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

async function updateFeedbackResponse( collection, feedback, res )
{
	var numQuestions = Object.keys( feedback ).length;
	console.log( "Number of Questions: " + numQuestions );

	for( question in feedback )
	{
		var answer = feedback[ question ];

		console.log( "Q: '" + question + "'\nA: '" + answer + "'" );
		
		var response;

		try
		{
			// Search for question in table
			var searchQuery = {};
			searchQuery[ "question" ] = question;
			response = await getItem( searchQuery, {}, collection );

			// Create question in table if it doesn't exist
			if( response === null )
			{
				var feedbackQuestion = {};
				feedbackQuestion[ "question" ] = question;
				response = await addItem( feedbackQuestion, collection );
			}

			// Update item with matching question
			var query = {};
			query[ "question" ] = question;

			// Increment the frequency of the answer by 1
			var update = {};
			update[ "$inc" ] = {};
			update[ "$inc" ][ answer ] = 1;

			// Return updated document
			var options = { returnOriginal : false, returnNewDocument : true };

			response = await updateItem( query, update, options, collection );

			console.log( "Response: " + JSON.stringify( response ) );
		}
		catch( e )
		{
			console.log( "Fatal error updating feedback.\nError log: " + e.message );
			res.statusCode = 500;
			res.end( JSON.stringify( { "response" : "fatal error updating feedback stats" } ) );
			return;
		}
	}

	res.end( JSON.stringify( { "response" : "successfully updated feedback responses" } ) );
	return;
}

async function getResponses( collection, res )
{
	try
	{
		var query = {};
		var options = { _id : 0, "question" : 1 };

		console.log( "Query: " + JSON.stringify( query ) + "\nOptions: " + JSON.stringify( options ) );

		var response = await getItems( query, options, collection );
		
		var i;
		for( i = 0; i < response.length; i++ )
		{
			delete response[ i ][ "_id" ];
		}
		
		console.log( "Survey response results: " + JSON.stringify( response ) );
		res.end( JSON.stringify( response ) );
		return;
	}
	catch( e )
	{
		console.log( "Fatal error getting survey feedback results.\nError log: " + e.message );
		res.statusCode = 500;
		res.end( JSON.stringify( { "response" : "fatal error getting survey feedback results" } ) );
		return;
	}
}

async function getItem( query, options, collection )
{
	return collection.findOne( query, options );
}

async function getItems( query, options, collection )
{
	return collection.find( query, options ).toArray();
}

async function addItem( item, collection )
{
	return collection.insertOne( item );
}

async function updateItem( query, update, options, collection )
{
	return collection.findOneAndUpdate( query, update, options );
}


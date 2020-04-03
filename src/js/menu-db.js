const MongoClient = require( 'mongodb' ).MongoClient;

const http = require( 'http' );
const url = require( 'url' );
const fs = require( 'fs' );
const formidable = require( 'formidable' );

const hostname = 'localhost';
const port = 3005;

const server = http.createServer( ( req, res ) =>  {
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
	 	if( err ) throw err;

	 	// Select restaurant database and menu-items collection
	 	var collection = db.db( "restaurant" ).collection( "menu-items" );


	 	if( path == "/menu/view" )
	 	{
	 		viewMenuItems( collection, res );
	 	}
	 	else if( path == "/menu/edit" )
	 	{
	 		// Stringified JSON of updated item
	 		let body = '';

	 		// Asynchronous. Keep appending data until all data is read
	 		req.on( 'data', ( chunk ) => { body += chunk; } );

	 		// Data is finished being read. edit item
	 		req.on( 'end', () => { editMenuItem( JSON.parse( body ), collection, res ) } );
	 	}
	 	else if( path == "/menu/create" )
	 	{
			console.log( "Reading Data." );
	 		// Stringified JSON of updated item
	 		let body = '';

	 		// Asynchronous. Keep appending data until all data is read
	 		// req.on( 'data', ( chunk ) => { body += chunk; } );

	 		// Data is finished being read. edit item
	 		// req.on( 'end', () => { 
				// console.log( "Body: '" + body + "'\n\n" ); 
			
				var form = new formidable.IncomingForm();
				console.log( "Form created.\n\n" );
				form.parse( req, function( err, fields, files ) {
					if( err )
					{
						console.log( "Error.\n\n" );
						throw err;
					}
					console.log( "Form Data: " + JSON.stringify( files ) + "\n\n Done.\n\n" );
					var returnVal = { "success" : "yes" };
					res.end( JSON.stringify( returnVal ) );
				} );
				console.log( "Form parse passed.\n\n" );
				
				res.end( JSON.stringify( { "success" : "no" } ) ); 
			// } );
			// req.on( 'end', () => { editMenuItem( JSON.parse( body ), collection, res ) } );
	 	}
	 	else if( path == "/menu/delete" )
	 	{
	 		// Stringified JSON of updated item
	 		let body = '';

	 		// Asynchronous. Keep appending data until all data is read
	 		req.on( 'data', ( chunk ) => { body += chunk; } );

	 		// Data is finished being read. edit item
	 		req.on( 'end', () => { deleteMenuItem( JSON.parse( body ), collection, res ) } );
	 	}
		else
		{
			console.log( "Invalid path: '" + path + "'.\n\n" );
			res.end( "Error.\n" );
		}
	} );
} );

server.listen( port, hostname, () => {
	// Display time to log for debugging
	var date = new Date().toISOString().substr( 11, 8 );
	console.log(  "(" + date + "): " ); 
});

function viewMenuItems( collection, res )
{
	collection.find( {} ).toArray( function( err, result ) {
		if( err ) throw err;

		console.log( 	"Items found in menu-item database:\n" +
						JSON.stringify( result ) +
						"\n\n" );

		// Send list of items back
		res.end( JSON.stringify( result ) );
	} );
}


function editMenuItem( updatedQuery, collection, res )
{
	var query = {};
	query[ "name" ] = updatedQuery.name;

	collection.findOneAndUpdate( query, { $set: updatedQuery }, { returnOriginal: false, returnNewDocument: true }, 
		function( err, result ) {
			if( err ) throw err;

			console.log( 	"Item edited in menu-item database:\n" + 
				JSON.stringify( result.value ) +
				"\n\n" );

			// Send updated value back
			res.end( JSON.stringify( result.value ) );
		}
	);
}

function createMenuItem( newItem, collection, res )
{
	collection.insertOne( newItem, function( err, result ) {
 		if( err ) throw err;

		console.log( 	"Item created in menu-item database:\n" + 
						JSON.stringify( result.ops[ 0 ] ) +
						"\n\n" );

		// Send item created back
 		res.end( JSON.stringify( result.ops[ 0 ] ) );
 	} );
}

function deleteMenuItem( query, collection, res )
{
	var deleteItem = {};
	deleteItem[ "name" ] = query.name;

	console.log( "Attempting to delete item with name: '" + deleteItem.name + "'.\n" );

		collection.deleteOne( deleteItem, function( err, result ) {
 		if( err ) throw err;

			console.log( 	"Result of removing item from menu-item database:\n" +
				JSON.stringify( result.result ) + 
				"\n\n" );

			// Send status of removing item back
 		res.end( JSON.stringify( result.result ) + "\n" );
 	} );
}

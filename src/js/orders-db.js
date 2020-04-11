const MongoClient = require( 'mongodb' ).MongoClient;
const mongo = require( 'mongodb' );

const http = require( 'http' );
const url = require( 'url' );
const fs = require( 'fs' );
const formidable = require( 'formidable' );

const hostname = 'localhost';
const port = 3007;

const server = http.createServer( ( req, res ) =>  {
	// Display date and action for debugging
	var date = new Date().toISOString().substr( 11, 8 );
	console.log( " \n \n \n(" + date  + "): Orders Query." );


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
	 	var collection = db.db( "restaurant" ).collection( "orders" );

	 	if( path == "/orders/view" )
	 	{
	 		viewOrders( collection, res );
	 	}
	 	else if( path == "/orders/create" )
	 	{
	 		// Stringified JSON of new account values
	 		let body = '';

	 		// Asynchronous. Keep appending data until all data is read
	 		req.on( 'data', ( chunk ) => { body += chunk; } );

	 		// Data is finished being read. edit item
	 		req.on( 'end', () => { 
				console.log( "Received: \n" + body + "\n" ); 
				createOrder( JSON.parse( body ), collection, res ); 
			});
	 	}
	 	else if( path == "/orders/delete" )
	 	{
	 		// Stringified JSON of new account values
	 		let body = '';

	 		// Asynchronous. Keep appending data until all data is read
	 		req.on( 'data', ( chunk ) => { body += chunk; } );

	 		// Data is finished being read. Delete item
	 		req.on( 'end', () => { 
				console.log( "Received: \n" + body + "\n" ); 
				
				var obj = JSON.parse( body );

				var deleteItem = {}
				deleteItem[ "_id" ] = new mongo.ObjectId( obj[ "_id" ] );

				deleteOrder( deleteItem, collection, res ); 
			});
		}
		else if( path == "/orders/pay" )
		{
	 		// Stringified JSON of new account values
	 		let body = '';

	 		// Asynchronous. Keep appending data until all data is read
	 		req.on( 'data', ( chunk ) => { body += chunk; } );

			// Data is finished being read. Pay order
			req.on( 'end', () => {
				// Get JSON object sent from user
				var obj = JSON.parse( body );

				// Make sure all fields are not empty
				if( 	obj[ "_id" ] === undefined || obj[ "_id" ] === "" ||
					obj[ "method" ] === undefined || obj[ "method" ] === "" || 
					( obj[ "method" ] !== "card" && obj[ "method" ] !== "cash" ) ||
					obj[ "amount" ] === undefined || obj[ "amount" ] === "" ||
					isNaN( parseFloat( obj[ "amount" ] ) ) || parseFloat( obj[ "amount" ] ) < 0 ||
					obj[ "tip" ] === undefined || obj[ "tip" ] === "" ||
					isNaN( parseFloat( obj[ "tip" ] ) ) || parseFloat( obj[ "tip" ] ) < 0 ||
					obj[ "receipt" ] === undefined || obj[ "receipt" ] === "" ||
					( obj[ "receipt" ] !== "print" && obj[ "receipt" ] !== "email" ) )
				{
					console.log( "Incorrect input format." );

					res.statusCode = 400;
					res.end( JSON.stringify( { "success" : "no" } ) );
					return;
				}

				console.log( "Data: " + body );
				
				payOrder( JSON.parse( body ), collection, res );
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

function viewOrders( collection, res )
{
	collection.find( {} ).toArray( function( err, result ) {
 		if( err )
 		{
 			console.log( "Error querying database." );
 			res.statusCode = 500;								// Internal Server Error
 			res.end( JSON.stringify( { "succes" : "no" } ) );	// Unsuccessful action
 			throw err;	
 		} 

		console.log( 	"Items found in orders database:\n" +
						JSON.stringify( result ) +
						"\n\n" );

		// Send list of items back
		res.end( JSON.stringify( result ) );
	} );
}

function createOrder( order, collection, res )
{
	// Get subtotal from order
	var subtotal = 0.0;
	var items = order[ "items" ];
	for( attr in items )
	{
		currItem = items[ attr ];
		console.log( currItem + ": $" + currItem[ "price" ] );
		subtotal += currItem[ "price" ];
	}

	order[ "subtotal" ] = subtotal;
	order[ "tax" ] = subtotal * 0.0825;
	order[ "total" ] = order[ "subtotal" ] + order[ "tax" ];

	collection.insertOne( order, function( err, result ) {
 		if( err )
 		{
 			console.log( "Error inserting." );
 			res.statusCode = 500;								// Internal Server Error
 			res.end( JSON.stringify( { "succes" : "no" } ) );	// Unsuccessful action
 			throw err;	
 		} 

 		// Display new item for debugging
 		console.log( "Inserted: " + JSON.stringify( result.ops[ 0 ] ) );

 		// Send the new item back
 		res.end( JSON.stringify( result.ops[ 0 ] ) );
 	} );
}

function deleteOrder( deleteItem, collection, res )
{
	console.log( "Attempting to delete object: " + JSON.stringify( deleteItem ) );

	collection.deleteOne( deleteItem, function( err, result ) {
		if( err )
		{
			console.log( "Error deleting order." );
			res.statusCode = 500;								// Internal Server Error
			res.end( JSON.stringify( { "success" : "no" } ) );	// Unsuccessful action
			throw err;
		}

 		// Display deleted result for debugging
 		console.log( "Deleted: " + JSON.stringify( result ) );

 		// Send deleted result back
 		res.end( JSON.stringify( result.result ) );
	} );
}

function payOrder( input, collection, res )
{
	console.log( "Beginning pay for order ID " + input[ "_id" ] );

	// Create item with unique _id to search for order
	var searchItem = {}
	searchItem[ "_id" ] = new mongo.ObjectId( input[ "_id" ] );

	// Search for order with given _id value
	collection.findOne( searchItem, function( err, result ) {
		if( err )
		{
			console.log( "Could not find order." );
			res.statusCode = 500;
			res.end( JSON.stringify( { "response" : "Could not find order." } ) );
			throw err;
		}

		// Result is null if the item is not found
		if( result === null )
		{
			console.log( "Did not find order." );
			res.statusCode = 400;
			res.end( "Did not find order." );
			return;
		}

		// If amount to pay is less than amount owed, update tota
		// Otherwise, clear total
		if( input[ "amount" ] < result[ "total" ] )
		{
			var previousTotal = result[ "total" ];
			result[ "total" ] -= input[ "amount" ];
			
			console.log( "Applied payment of $" + input[ "amount" ] + ".\n" 
					+ "Old Total: $" + previousTotal + "\n"
					+ "New Total: $" + result[ "total" ] );
		}
		else
		{
			var previousTotal = result[ "total" ];
			result[ "total" ] = 0;

			console.log( "Applied payment of $" + previousTotal + ".\n"
					+ "Old Total: $" + previousTotal + "\n"
					+ "New Total: $" + result[ "total " ] );
		}

		// Update order
		collection.findOneAndUpdate( searchItem, { $set : result }, { returnOriginal : false, returnNewDocument : true }, function( err, result ) {
			if( err )
			{
				res.statusCode = 500;
				res.end( JSON.stringify( { "success" : "no" } ) );
				throw err;
			}

			// Display updated order for debugging
			console.log( "Updated order: " + JSON.stringify( result.value ) );

			// Send the updated item back
			res.end( JSON.stringify( result.value ) );
		});
	});
}


const MongoClient = require( 'mongodb' ).MongoClient;
const mongo = require( 'mongodb' );

const http = require( 'http' );
const url = require( 'url' );
const fs = require( 'fs' );
const formidable = require( 'formidable' );
const nodemailer = require( 'nodemailer' );

const hostname = 'localhost';
const port = 3011;

const server = http.createServer( ( req, res ) =>  {
	// Display date and action for debugging
	var date = new Date().toISOString().substr( 11, 8 );
	console.log( " \n \n \n(" + date  + "): Coupons Query." );


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
	 	var collection = db.db( "restaurant" ).collection( "coupons" );

	 	if( path == "/coupons/create" )
	 	{
	 		// Stringified JSON of new account values
	 		let body = '';

	 		// Asynchronous. Keep appending data until all data is read
	 		req.on( 'data', ( chunk ) => { body += chunk; } );

	 		// Data is finished being read. edit item
	 		req.on( 'end', () => { 
	 			console.log( "Coupon Create data received: " + body );

	 			var obj = JSON.parse( body );

	 			// Verify all fields
	 			if( obj[ "name" ] === undefined || obj[ "name" ] === "" )
	 			{
	 				console.log( "Invalid name '" + obj[ "name" ] + "'." );

	 				res.statusCode = 400;
	 				res.end( JSON.stringify( { "response" : "invalid name" } ) );
	 				return;
	 			}

	 			if( obj[ "discount" ] === undefined || obj[ "discount" ] === "" ||
	 				isNaN( parseFloat( obj[ "discount" ] ) ) || ( parseFloat( obj[ "discount" ] ) < 0 && parseFloat( obj[ "discount" ] ) > 100 ) )
	 			{
	 				console.log( "Invalid discount amount '" + obj[ "discount" ] + "'." );

	 				res.statusCode = 400;
	 				res.end( JSON.stringify( { "response" : "invalid discount" } ) );
	 				return;
	 			}

	 			if( obj[ "expiration" ] === undefined || obj[ "expiration" ] === "" || 
	 				!( /[0-9]{4}-[0-9]{2}-[0-9]{2}/.test( obj[ "expiration" ] ) ) )
	 			{
	 				console.log( "Invalid expiration value '" + obj[ "expiration" ] + "'." );

					res.statusCode = 400;
					res.end( JSON.stringify( { "response" : "invalid expiration" } ) );
					return;
	 			}

	 			if( obj[ "rewards" ] === undefined || obj[ "rewards" ] === "" )
	 			{
	 				console.log( "Invalid rewards amount '" + obj[ "rewards" ] + "'." );

	 				res.statusCode = 400;
	 				res.end( JSON.stringify( { "response" : "invalid rewards" } ) );
	 				return;
	 			}

	 			// Create coupon
	 			var coupon = {};
	 			coupon[ "name" ] = obj[ "name" ];
	 			coupon[ "discount" ] = obj[ "discount" ];
	 			coupon[ "expiration" ] = obj[ "expiration" ];
	 			coupon[ "rewards" ] = obj[ "rewards" ];

				console.log( "Coupon to create: " + JSON.stringify( coupon ) );

				createCoupon( coupon, collection, res ); 
	 		});
	 	}
	 	else if( path == "/coupons/view" )
	 	{
	 		viewCoupons( collection, res );
		}
	 	else if( path == "/coupons/verify" )
	 	{
	 		// Stringified JSON of new account values
	 		let body = '';

	 		// Asynchronous. Keep appending data until all data is read
	 		req.on( 'data', ( chunk ) => { body += chunk; } );

	 		// Data is finished being read. Update table status
	 		req.on( 'end', () => {
	 			console.log( "Received: \n" + body + "\n" );

	 			var obj = JSON.parse( body );

	 			// Check that _id field is valid
	 			if( obj[ "_id" ] === undefined || obj[ "_id" ] === ""  )
	 			{
					console.log( "Invalid _id value '" + obj[ "_id" ] + "'." );

					res.statusCode = 400;
					res.end( JSON.stringify( { "success" : "no" } ) );
					return;
	 			}


	 			// Ensure JSON object only has _id field
	 			var coupon = {}
	 			coupon[ "_id" ] = new mongo.ObjectId( obj[ "_id" ] );

	 			// Update status
	 			findCoupon( coupon, collection, res );
	 		});
	 	}
	 	else if( path == "/coupons/delete" )
	 	{
	 		// Stringified JSON of new account values
	 		let body = '';

	 		// Asynchronous. Keep appending data until all data is read
	 		req.on( 'data', ( chunk ) => { body += chunk; } );

	 		// Data is finished being read. Delete item
	 		req.on( 'end', () => { 
				console.log( "Received: \n" + body + "\n" ); 

				var obj = JSON.parse( body );

				// Check that _id is valid
				if( obj[ "_id" ] === undefined || obj[ "_id" ] === "" || obj[ "_id" ].length !== 24 )
				{
					res.statusCode = 400;
					res.end( JSON.stringify( { "response" : "bad _id format" } ) );
					return;
				}

				var coupon = {};
				coupon[ "_id" ] = new mongo.ObjectId( obj[ "_id" ] );

				deleteCoupon( coupon, collection, res ); 
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

function viewCoupons( collection, res )
{
	collection.find( {} ).toArray( function( err, result ) {
 		if( err )
 		{
 			console.log( "Error querying database." );
 			res.statusCode = 500;														// Internal Server Error
 			res.end( JSON.stringify( { "response" : "error querying database" } ) );	// Unsuccessful action
 			throw err;	
 			return;
 		} 

 		// Debugging output
		console.log( "Items found in coupon database:\n" + JSON.stringify( result ) + "\n\n" );

		// Send list of items back
		res.end( JSON.stringify( result ) );
	} );
}

function createCoupon( coupon, collection, res )
{
	collection.insertOne( coupon, function( err, result ) {
 		if( err )
 		{
 			console.log( "Error inserting coupon." );
 			res.statusCode = 500;														// Internal Server Error
 			res.end( JSON.stringify( { "response" : "error inserting coupon" } ) );	// Unsuccessful action
 			throw err;	
 			return;
 		} 

 		// Display new item for debugging
 		console.log( "Inserted Coupon: " + JSON.stringify( result.ops[ 0 ] ) );

 		// Send the new item back
 		res.end( JSON.stringify( result.ops[ 0 ] ) );
 	} );
}

async function findCoupon( coupon, collection, res )
{
	console.log( "Attempting coupon verification:\n    _id: " + coupon[ "_id" ] + "\n" );

	try
	{
		// Find coupon
		var couponReturn = await getItem( coupon, collection );

		if( couponReturn === null )
		{
			console.log( "Unable to verify coupon" );

	 		res.statusCode = 500;
	 		res.end( JSON.stringify( { "response" : "unable to verify coupon" } ) );
	 		return;
		}

		console.log( "Successful verification : " + JSON.stringify( couponReturn.value ) );

		// Delete the coupon
		var deleteReturn = await removeItem( coupon, collection );

		if( deleteReturn[ "deletedCount" ] !== 1 )
		{
			console.log( "Unable to delete coupon" );

	 		res.statusCode = 500;
	 		res.end( JSON.stringify( { "response" : "unable to delete coupon" } ) );
	 		return;
		}

		console.log( "Succesful deletion: " + JSON.stringify( deleteReturn ) );

		// Return coupon to client
		res.end( JSON.stringify( couponReturn ) );
	}
	catch( e )
	{
		console.log( "Fatal error while verifying.\nError log: " + e.message );

		res.statusCode = 500;
		res.end( JSON.stringify( { "response": "fatal error while verifrying" } ) );
		return;
	}
}

async function getItem( query, collection )
{
	return collection.findOne( query );
}

async function removeItem( query, collection )
{
	return collection.deleteOne( query );
}

function deleteCoupon( coupon, collection, res )
{
	console.log( "Attempting to delete employee: " + JSON.stringify( coupon ) );

	collection.deleteOne( coupon, function( err, result ) {
		if( err )
		{
			console.log( "Error deleting coupon." );
			res.statusCode = 500;													// Internal Server Error
			res.end( JSON.stringify( { "response" : "error deleting coupon" } ) );	// Unsuccessful action
			throw err;
		}

 		// Display deleted result for debugging
 		console.log( "Deleted Coupon: " + JSON.stringify( result ) );

 		// Send deleted result back
 		res.end( JSON.stringify( result.result ) );
	} );
}

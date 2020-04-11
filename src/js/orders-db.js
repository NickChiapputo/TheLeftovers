const MongoClient = require( 'mongodb' ).MongoClient;
const mongo = require( 'mongodb' );

const http = require( 'http' );
const url = require( 'url' );
const fs = require( 'fs' );
const formidable = require( 'formidable' );
const nodemailer = require( 'nodemailer' );

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
					isNaN( parseFloat( obj[ "amount" ] ) ) || parseFloat( obj[ "amount" ] ) <= 0 ||
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
				
				payOrder( obj, db.db( "restaurant" ).collection( "tables" ), collection, res );
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

	order[ "subtotal" ] = Math.round( ( subtotal + 0.00001 ) * 100 ) / 100;
	order[ "tax" ] = Math.round( ( subtotal * 0.0825 + 0.00001 ) * 100 ) / 100;
	order[ "total" ] = Math.round( ( order[ "subtotal" ] + order[ "tax" ] + 0.00001 ) * 100 ) / 100;

	// Remove _id tag if added previously
	delete order[ "_id" ];

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

function payOrder( input, tableCollection, collection, res )
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

		// Save previous total amount
		var previousTotal = result[ "total" ];

		// If amount to pay is less than amount owed, update tota
		// Otherwise, clear total
		if( input[ "amount" ] < result[ "total" ] )
		{
			result[ "total" ] -= input[ "amount" ];
			result[ "total" ] = Math.round( ( result[ "total" ] + 0.00001 ) * 100 ) / 100;
			result[ "status" ] = "partially paid";

			console.log( "Applied payment of $" + input[ "amount" ] + ".\n" 
					+ "Old Total: $" + previousTotal + "\n"
					+ "New Total: $" + result[ "total" ] );
		}
		else
		{
			result[ "total" ] = 0;
			result[ "status" ] = "paid";

			console.log( "Applied payment of $" + previousTotal + ".\n"
					+ "Old Total: $" + previousTotal + "\n"
					+ "New Total: $" + result[ "total " ] );
		}

		// Update order
		collection.findOneAndUpdate( searchItem, { $set : result }, { returnOriginal : false, returnNewDocument : true }, function( err, updatedResult ) {
			if( err )
			{
				res.statusCode = 500;
				res.end( JSON.stringify( { "success" : "no" } ) );
				throw err;
			}

			// Display updated order for debugging
			console.log( "Updated order: " + JSON.stringify( updatedResult.value ) );

			// Update table
			var table = {};
			table[ "table" ] = updatedResult.value[ "table" ];
			
			var updatedQuery = {};
			if( updatedResult.value[ "total" ] == 0 )
			{
				updatedQuery[ "status" ] = "paid";
			}
			else
			{
				updatedQuery[ "status" ] = "partially paid";
			}

			console.log( "Updated Query Status: '" + updatedQuery[ "status" ] + "' for table " + table[ "table" ] + "." ); 

			tableCollection.findOneAndUpdate( table, { $set : updatedQuery }, { returnOriginal : false, returnNewDocument : true }, function( err, updatedTable ) {
				if( err )
				{
					console.log( "Unable to update table " + table[ "table" ] + " status." );
					res.statusCode = 500;
					res.end( JSON.stringify( { "response" : "unable to update table stats" } ) );
					throw err;
					return;
				}
			
				var newTable = updatedTable.value;

				console.log( "Updated Table: " + JSON.stringify( newTable ) );

				if( newTable === null )
				{
					console.log( "Could not find table " + table[ "table" ] + "." );
					res.statusCode = 400;
					res.end( JSON.stringify( { "response" : "could not find table" } ) );
					return;
				}

				if( newTable == null )
				{
					console.log( "Could not find table " + table[ "table" ] + "." );
					res.statusCode = 400;
					res.end( JSON.stringify( { "response" : "could not find table" } ) );
					return;
				}

				if( newTable === undefined )
				{
					console.log( "Could not find table " + table[ "table" ] + "." );
					res.statusCode = 400;
					res.end( JSON.stringify( { "response" : "could not find table" } ) );
					return;
				}

				console.log( "Updated status for table " + table[ "table" ] + " to '" + newTable[ "status" ] + "'." );
			});

			// Check if receipt method is e-mail
			if( input[ "receipt" ] === "email" )
			{
				// Check if e-mail is empty
				if( input[ "email" ] === undefined || input[ "email" ] === "" )
				{
					res.statusCode = 400;
					res.end( JSON.stringify( { "response" : "Invalid e-mail." } ) );
					return;
				}

				console.log( "Send receipt by e-mail." );

				// Create transport for e-mail source
				var transporter = nodemailer.createTransport( {
					// sendmail: true,
					service: 'gmail',
					auth: {
						user: 'theleftovers.csce3444@gmail.com',
						pass: 'theLeftovers!'
					}
				});

				// Create subject text for e-mail
				var subject = "Receipt for Order #" + input[ "_id" ] + " - The Leftovers";

				// Create body text for e-mail

				// Add document headers and CSS styling
				mailBody = "<!doctype html><html><head><meta charset='utf-8'><title>A simple, clean, and responsive HTML invoice template</title><style>.invoice-box{max-width:800px;margin:auto;padding:30px;border:1px solid #eee;box-shadow:0 0 10px rgba(0, 0, 0, .15);font-size:16px;line-height:24px;font-family:'Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;color:#555}.invoice-box table{width:100%;line-height:inherit;text-align:left}.invoice-box table td{padding:5px;vertical-align:top}.invoice-box table tr td:nth-child(2){text-align:right}.invoice-box table tr.top table td{padding-bottom:20px}.invoice-box table tr.top table td.title{font-size:45px;line-height:45px;color:#333}.invoice-box table tr.information table td{padding-bottom:40px}.invoice-box table tr.heading td{background:#eee;border-bottom:1px solid #ddd;font-weight:bold}.invoice-box table tr.details td{padding-bottom:20px}.invoice-box table tr.item td{border-bottom:1px solid #eee}.invoice-box table tr.item.last td{border-bottom:none}.invoice-box table tr.total td:nth-child(2){border-top:2px solid #eee;font-weight:bold}@media only screen and (max-width: 600px){.invoice-box table tr.top table td{width:100%;display:block;text-align:center}.invoice-box table tr.information table td{width:100%;display:block;text-align:center}}.rtl{direction:rtl;font-family:Tahoma,'Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif}.rtl table{text-align:right}.rtl table tr td:nth-child(2){text-align:left}</style></head><body>";

				// Add header
				mailBody += 	"<div class='invoice-box'><table cellpadding='0' cellspacing='0'><tr class='top'><td colspan='2'><table><tr><td class='title'></td>" + 
						"<td>Order #: " + input[ "_id" ] + "<br>" + 
						"Created: " + new Date().toISOString().replace( /T/, ' ' ).replace( /\..+/, '' ) + " UTC</td></tr></table></td></tr>" + 

				// Add payment method
						"<tr class='heading'><td>Payment Method</td><td></td></tr>" + 
					
				// Add payment details	
						"<tr class='details'><td>" + input[ "method" ] + "</td><td></td></tr>" + 

				// Add items
						"<tr class='heading'><td>Item</td><td>Price</td></tr>";

				var newResult = updatedResult.value;
				var i;
				var numItems = Object.keys( newResult[ "items" ] ).length;
				console.log( numItems + " items in order." );
				for( i = 0; i < numItems - 1; i++ )
				{
					var item = newResult[ "items" ][ i ];
					mailBody += "<tr class='item'><td>" + item[ "name" ] + "</td><td>$" + item[ "price" ] + "</td></tr>";
				}

				// Add last item
				mailBody += "<tr class='item last'><td>" + newResult[ "items"][ numItems - 1 ][ "name" ] + "</td><td>$" + newResult[ "items" ][ numItems - 1 ][ "price" ] + "</td></tr>";

				// Add subtotal
				mailBody += "<tr class='total'><td></td><td>Subtotal: $" + newResult[ "subtotal" ] + "</td></tr>";

				// Add tax
				mailBody += "<tr class='total'><td></td><td>Tax: $" + newResult[ "tax" ] + "</td></tr>";

				// Add old total
				mailBody += "<tr class='total'><td></td><td>Total: $" + previousTotal + "</td></tr>";

				// Add payment
				if( newResult[ "subtotal" ] + newResult[ "tax" ] > previousTotal )
					mailBody += "<tr class='total'><td></td><td>Previous Payments: -$" + ( newResult[ "subtotal" ] + newResult[ "tax" ] - previousTotal ) + "</td></tr>";
				mailBody += "<tr class='total'><td></td><td>Total: $" + previousTotal + "</td></tr>";
				mailBody += "<tr class='total'><td></td><td>Payment: -$" + input[ "amount" ] + "</td></tr>";
				mailBody += "<tr class='total'><td></td><td>Remaining Balance: $" + newResult[ "total" ] + "</td></tr>";

				// Close remaining tags
				mailBody += "</table></div></body></html>";


				// Create e-mail data
				var mailOptions = {
					from: 'theleftovers.csce3444@gmail.com',
					to: input[ "email" ],
					subject: subject,
					html: mailBody,
				};

				// Send e-mail
				console.log( "Sending e-mail..." );
				transporter.sendMail( mailOptions, function( err, info ) {
					if( err )
					{
						console.log( "Error sending e-mail: " + err );

						res.statusCode = 500;

						var response = {}
						response.response = err;
						
						res.end( JSON.stringify( response ) );
						return;
					}

					console.log( "E-mail sent to " + input[ "email" ] + "\n" + info.response );
				});
			}

			// Send the updated item back
			res.end( JSON.stringify( updatedResult.value ) );
		});
	});
}


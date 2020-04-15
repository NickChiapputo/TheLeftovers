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
				var obj = JSON.parse( body );

				// Verify that table is valid
				if( obj[ "table" ] === undefined || obj[ "table" ] === "" || isNaN( parseInt( obj[ "table" ] ) ) || parseInt( obj[ "table" ] ) < 1 || parseInt( obj[ "table" ] ) > 20 )
				{
					console.log( "Invalid table number '" + obj[ "table" ] + "'." );
					
					res.statusCode = 400;
					res.end( JSON.stringify( { "response" : "invalid table number" } ) );
					return;
				}

				// Verify that rewards is valid if applicable
				if( obj[ "rewards" ] !== undefined && obj[ "rewards" ] !== "" && ( obj[ "rewards" ].length !== 10 || isNaN( parseInt( obj[ "rewards" ] ) ) ) )
				{
					console.log( "Invalid rewards number '" + obj[ "rewards" ] + "'." );
					
					res.statusCode = 400;
					res.end( JSON.stringify( { "response" : "invalid rewards number" } ) );
					return;
				}
				
				console.log( "Received: \n" + body + "\n \n " ); 
				createOrder( JSON.parse( body ), db, res ); 
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
				
				payOrder( obj, db, res );
			});
		}
		else if( path == "/orders/status" )
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
				if( 	obj[ "_id" ] === undefined || obj[ "_id" ] === "" )
				{
					console.log( "Invalid _id '" + obj[ "_id" ] + "'." );

					res.statusCode = 400;
					res.end( JSON.stringify( { "response" : "invalid _id value" } ) );
					return;
				}

				// Verify status update value
				if( obj[ "status" ] === undefined || obj[ "status" ] === "" || 
					( obj[ "status" ] !== "in progress" && obj[ "status" ] !== "complete" ) )
				{
					console.log( "Invalid status '" + obj[ "status" ] + "'." );

					res.statusCode = 400;
					res.end( JSON.stringify( { "response" : "invalid status value" } ) );
					return;
				}

				console.log( "Update status query: " + body );

				var query = {}
				query[ "_id" ] = mongo.ObjectId( obj[ "_id" ] );

				var update = {};
				update[ "$set" ] = {}
				update[ "$set" ][ "status" ] = obj[ "status" ];
				
				updateStatus( query, update, collection, res );
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

async function createOrder( order, db, res )
{
	var orderCollection = db.db( "restaurant" ).collection( "orders" );
	var statsCollection = db.db( "restaurant" ).collection( "menu-item-stats" );

	// Get subtotal from order and update order counts for items
	var date = new Date().toISOString().substring( 0, 10 );
	console.log( "Date: " + date );
	var subtotal = 0.0;
	var items = order[ "items" ];
	for( attr in items )
	{
		currItem = items[ attr ];
		console.log( currItem[ "name" ] + ": $" + currItem[ "price" ] );
		subtotal += currItem[ "price" ];

		// Update order count for each item in this day
		var statsItem = {}
		statsItem[ "name" ] = currItem[ "name" ];

		// Get stats item
		let stats = await getItem( statsItem, statsCollection );

		// If stats item exists
		if( stats )
		{
			var query = {};
			query[ "name" ] = currItem[ "name" ];

			var update = {};
			update[ "$inc" ] = {};
			update[ "$inc"][ date ] = 1;

			let incrementResult = await incrementStatsItem( query, update, statsCollection );
			console.log( "Increment Result: " + JSON.stringify( incrementResult ) );
		}
		else
		{
			console.log( currItem[ "name" ] + " does not exist in stats." );
		}
	}

	// Separate logs for easier viewing
	console.log( "\n " );

	order[ "subtotal" ] = Math.round( ( subtotal + 0.00001 ) * 100 ) / 100;
	order[ "tax" ] = Math.round( ( subtotal * 0.0825 + 0.00001 ) * 100 ) / 100;
	order[ "total" ] = Math.round( ( order[ "subtotal" ] + order[ "tax" ] + 0.00001 ) * 100 ) / 100;

	// Remove _id tag if added previously
	delete order[ "_id" ];

	// Loop through each menu item and check if all ingredients exist and if there are enough of it 
	var inventoryCollection = db.db( "restaurant" ).collection( "inventory" );
	var menuItemCollection = db.db( "restaurant" ).collection( "menu-items" ); 
	var numItems = Object.keys( order[ "items" ] ).length;
	var i = 0;
	for( i = 0; i < numItems; i++ )
	{
		var item = order[ "items" ][ i ];

		console.log( "Checking for existence of '" + item[ "name" ] + "'." );

		var menuItemCheckResponse;

		try
		{
			var menuItemCheckQuery = {}
			menuItemCheckQuery[ "name" ] = item[ "name" ];

			menuItemCheckResponse = await getItem( menuItemCheckQuery, menuItemCollection );

			if( menuItemCheckResponse === null )
			{
				console.log( "Item '" + item[ "name" ] + "' does not exist." );

				res.statusCode = 400;
				res.end( JSON.stringify( { "response" : "menu item does not exist" } ) );
				return;
			}
		}
		catch( e )
		{
			console.log( "Fatal error checking menu item." );

			res.statusCode = 500;
			res.end( JSON.stringify( { "response" : "fatal error checking menu item" } ) );
			return;
		}

		var numIngredients = Object.keys( item[ "ingredients" ] ).length;
		var j = 0;

		// Check that all ingredients exist
		for( j = 0; j < numIngredients; j++ )
		{
			var ingredient = item[ "ingredients" ][ j ];

			if( item[ "hasIngredient" ][ j ] > 0 )
			{
				console.log( "    Checking for existence and count of ingredient '" + ingredient + "' that uses " + item[ "ingredientCount" ][ j ] + "." );

				try
				{
					// Check if ingredient exists
					var ingredientQuery = {}
					ingredientQuery[ "name" ] = ingredient;
					var ingredientResponse = await getItem( ingredientQuery, inventoryCollection );

					// Fail if ingredient doesn't exist
					if( ingredientResponse === null )
					{
						console.log( "        " + ingredient + " doesn't exist." );

						res.statusCode = 400;
						res.end( JSON.stringify( { "response" : "ingredient doesn't exist" } ) );
						return;
					}

					// Fail if ingredient count is less than current count 
					if( parseInt( ingredientResponse[ "count" ] ) < item[ "ingredientCount" ][ j ] )
					{
						console.log( "        " + ingredient + " only has " + ingredientResponse[ "count" ] + " but order requires " + item[ "ingredientCount" ][ j ] + "." );

						res.statusCode = 400;
						res.end( JSON.stringify( { "response" : "not enough ingredient remains" } ) );
						return;
					}

					console.log( "        Found item: " + JSON.stringify( ingredientResponse ) );
				}
				catch( e )
				{
					console.log( "        Fatal error checking ingredient.\nError log: " + e.message );

					res.statusCode = 500;
					res.end( JSON.stringify( { "response" : "fatal error checking ingredients" } ) );
					return;
				}
			}
		}

		console.log( "    All ingredients exist\n " );
	}

	// Loop through each menu item and udpate counts. Use error checking again in case of parallel orders causing issues
	for( i = 0; i < numItems; i++ )
	{
		var item = order[ "items" ][ i ];

		console.log( "Updating ingredient counts for item " + ( i + 1 ) + " '" + item[ "name" ] + "'." );

		var numIngredients = Object.keys( item[ "ingredients" ] ).length;
		var j = 0;

		for( j = 0; j < numIngredients; j++ )
		{
			var ingredient = item[ "ingredients" ][ j ];

			if( item[ "hasIngredient" ][ j ] > 0 )
			{
				console.log( "    Updating ingredient " + ( j + 1 ) + " '" + ingredient + "' that uses " + item[ "ingredientCount" ][ j ] + "." );

				try
				{
					// Check if ingredient exists
					var ingredientQuery = {}
					ingredientQuery[ "name" ] = ingredient;
					var ingredientResponse = await getItem( ingredientQuery, inventoryCollection );

					// Fail if ingredient doesn't exist
					if( ingredientResponse === null )
					{
						console.log( "        Ingredient " + ingredient + " doesn't exist." );

						res.statusCode = 400;
						res.end( JSON.stringify( { "response" : "ingredient doesn't exist" } ) );
						return;
					}

					// Fail if ingredient count is less than current count 
					if( parseInt( ingredientResponse[ "count" ] ) < item[ "ingredientCount" ][ j ] )
					{
						console.log( "        Ingredient only has " + ingredientResponse[ "count" ] + " but order requires " + item[ "ingredientCount" ][ j ] + "." );

						res.statusCode = 400;
						res.end( JSON.stringify( { "response" : "not enough ingredient remains" } ) );
						return;
					}

					var updateItemQuery = {}
					updateItemQuery[ "_id" ] = ingredientResponse[ "_id" ];

					var updateItemUpdate = {}
					updateItemUpdate[ "$set" ] = {};
					updateItemUpdate[ "$set" ][ "count" ] = ( parseInt( ingredientResponse[ "count" ] ) - item[ "ingredientCount" ][ j ] ).toString();
					console.log( "        Setting " + ingredient + " count to " + updateItemUpdate[ "$set" ][ "count" ] + " ( subtracting " + item[ "ingredientCount" ][ j ] + " from " + parseInt( ingredientResponse[ "count" ] ) + " )." );

					var updateItemOptions = { returnOriginal : false, returnNewDocument : true };
					
					var updateItemResponse = await updateItem( updateItemQuery, updateItemUpdate, updateItemOptions, inventoryCollection );
				}
				catch( e )
				{
					console.log( "        Fatal error checking ingredient.\nError log: " + e.message );

					res.statusCode = 500;
					res.end( JSON.stringify( { "response" : "fatal error checking ingredients" } ) );
					return;
				}
			}
		}

		console.log( " \n" );
	}

	try
	{
		// Set table status to ordered
		var tableQuery = {};
		tableQuery[ "table" ] = parseInt( order[ "table" ] );
		var tableUpdate = { $set : { "status" : "ordered" } };
		var tableOptions = { returnOriginal : false, returnNewDocument : true };
		var tableUpdateResponse = await updateItem( tableQuery, tableUpdate, tableOptions, db.db( "restaurant" ).collection( "tables" ) );

		console.log( "Table Update Response: " + JSON.stringify( tableUpdateResponse ) );


		// If rewards value is given, set last ordered meal
		if( order[ "rewards" ] !== undefined && order[ "rewards" ] !== "" )
		{
			var rewardsQuery = {};
			rewardsQuery[ "_id" ] = order[ "rewards" ];
			var rewardsUpdate = {};
			rewardsUpdate[ "$set" ] = {};
			rewardsUpdate[ "$set" ][ "lastMeal" ] = order[ "items" ];
			var rewardsOptions = { returnOriginal : false, returnNewDocument : true };

			console.log( "Setting last meal of rewareds account '" + rewardsQuery[ "_id" ] + "' to " + order[ "items" ] );

			var rewardsResponse = await updateItem( rewardsQuery, rewardsUpdate, rewardsOptions, db.db( "restaurant" ).collection( "rewards" ) );

			if( rewardsResponse.value === null )
			{
				console.log( "Unable to update rewards last meal." );
				return;
			}

			console.log( "Update rewards last meal\n" + JSON.stringify( rewardsResponse.value ) );
		}
	}
	catch( e )
	{
		console.log( "Fatal error updating table status.\nError log: " + e.message );

		res.statusCode = 500;
		res.end( JSON.stringify( { "response" : "fatal error updating table status" } ) );
		return;
	}

	orderCollection.insertOne( order, function( err, result ) {
 		if( err )
 		{
 			console.log( "Error inserting." );
 			res.statusCode = 500;								// Internal Server Error
 			res.end( JSON.stringify( { "succes" : "no" } ) );	// Unsuccessful action
 			throw err;	
 		}

 		// Display new item for debugging
 		console.log( "Created Order: " + JSON.stringify( result.ops[ 0 ] ) );
		
 		// Send the new item back
 		res.end( JSON.stringify( result.ops[ 0 ] ) );
 	} );
}

async function getItem( query, collection )
{
	return collection.findOne( query );
}

async function addNewOrderStat( itemName, newOrderStat, collection )
{
	return collection.findOneAndUpdate( itemName, { $addToSet : { "orders" : newOrderStat } }, { returnOriginal : false, returnNewDocument : true } );
}

async function updateItem( query, update, options, collection )
{
	return collection.findOneAndUpdate( query, update, options );
}

async function incrementStatsItem( query, update, collection )
{
	var options = { "upsert" : true };
	return collection.updateOne( query, update, options );
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

async function payOrder( input, db, res )
{
	console.log( "Beginning pay for order ID " + input[ "_id" ] );

	var ordersCollection = db.db( "restaurant" ).collection( "orders" );
	var tableCollection = db.db( "restaurant" ).collection( "tables" );
	var employeesCollection = db.db( "restaurant" ).collection( "employees" );

	try
	{
		// Create item with unique _id to search for order
		var searchItem = {}
		searchItem[ "_id" ] = new mongo.ObjectId( input[ "_id" ] );

		var order = await getItem( searchItem, ordersCollection );

		if( order === null )
		{
			console.log( "Did not find order." );
			res.statusCode = 400;
			res.end( JSON.stringify( { "response" : "did not find order" } ) );
			return;
		}


		// Save previous total amount
		var previousTotal = order[ "total" ];

		// If amount to pay is less than amount owed, update tota
		// Otherwise, clear total
		if( input[ "amount" ] < order[ "total" ] )
		{
			order[ "total" ] -= input[ "amount" ];
			order[ "total" ] = Math.round( ( order[ "total" ] + 0.00001 ) * 100 ) / 100;
			order[ "status" ] = "partially paid";

			console.log( "Applied payment of $" + input[ "amount" ] + ".\n" 
					+ "Old Total: $" + previousTotal + "\n"
					+ "New Total: $" + order[ "total" ] );
		}
		else
		{
			order[ "total" ] = 0;
			order[ "status" ] = "paid";

			console.log( "Applied payment of $" + previousTotal + ".\n"
					+ "Old Total: $" + previousTotal + "\n"
					+ "New Total: $" + order[ "total " ] );
		}


		// Update order
		var orderUpdate = {}
		orderUpdate[ "$set" ] = result;
		var updateOptions = { returnOriginal : false, returnNewDocument : true };

		var updatedOrder = await updateItem( searchItem, orderUpdate, updateOptions, ordersCollection );

		if( updatedOrder.value === null )
		{
			console.log( "Unable to update order." );
			res.statusCode = 400;
			res.end( JSON.stringify( { "response" : "unable to apply payment to order" } ) );
			return;
		}

		// Display updated order for debugging
		console.log( "Updated order: " + JSON.stringify( updatedOrder.value ) );

		// Update table
		var table = {};
		table[ "table" ] = parseInt( updatedOrder.value[ "table" ] );
		
		var tableUpdates = {};
		if( updatedOrder.value[ "total" ] == 0 )
		{
			// Reset back to initial state
			tableUpdates[ "status" ] = "sitting";
		}
		else
		{
			// Still has more left on bill
			tableUpdates[ "status" ] = "partially paid";
		}

		// Add tip if applicable
		var tip = 0.00;
		if( input[ "tip" ] !== undefined && input[ "tip" ] !== null && !isNaN( parseFloat( input[ "tip" ] ) ) && parseFloat( input[ "tip" ] ) > 0 )
		{
			tip = Math.round( ( parseFloat( input[ "tip" ] ) + 0.00001 ) * 100 ) / 100;
		}

		console.log( "Updated Query Status: '" + tableUpdates[ "status" ] + "' for table " + table[ "table" ] + "." ); 

		var updatedTableResponse = await updateItem( table, { $set : tableUpdates }, updateOptions, tableCollection );

		if( updatedTableResponse.value === null )
		{
			console.log( "Could not find table." );

			res.statusCode = 400;
			res.end( JSON.stringify( { "response" : "could not find table" } ) );
		}

		var newTable = updatedTableResponse.value;
		console.log( "Updated status for table " + table[ "table" ] + " to '" + newTable[ "status" ] + "'." );

		// Update employee tips if applicable
		if( tip > 0 )
		{
			var employeeQuery = {};
			employeeQuery[ "_id" ] = mongo.ObjectId( newTable[ "server" ] );
			var employeeUpdate = {};
			employeeUpdate[ "$inc" ] = {};
			employeeUpdate[ "$inc" ][ "tips" ] = tip;

			console.log( "Increasing tips by " + tip + " for server '" + employeeQuery[ "_id" ] + "'." );

			var employeeResult = await updateItem( employeeQuery, employeeUpdate, updateOptions, employeesCollection );

			if( employeeResult.value === null )
			{
				console.log( "Unable to add tip to server." );

				res.statusCode = 400;
				res.end( JSON.stringify( { "response" : "unable to add tip to server" } ) );
			}
		}

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

			var newResult = updatedOrder.value;
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
		res.end( JSON.stringify( updatedOrder.value ) );
	}
	catch( e )
	{
		console.log( "Fatal error when paying for order.\nError log: " + e.message );

		res.statusCode = 500;
		res.end( JSON.stringify( { "response" : "fatal error when paying for order" } ) );
		return;
	}
}

function updateStatus( query, update, collection, res )
{
	collection.findOneAndUpdate( query, update, { returnOriginal : false, returnNewDocument : true }, function( err, result ) {
		if( err )
		{
			res.statusCode = 500;
			res.end( JSON.stringify( { "response" : "fatal error updating status" } ) );
			throw err;
			return;
		}

		if( result === null )
		{
			console.log( "Unable to find order '" + query[ "_id" ] + "'." );

			result.statusCode = 400;
			result.end( JSON.stringify( { "response" : "could not find order" } ) );
			return;
		}

		console.log( "Found and updated order with status '" + result.value[ "status" ] + "'." );

		res.end( JSON.stringify( result.value ) );
	});
}

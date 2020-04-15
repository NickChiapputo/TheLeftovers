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
					console.log( "Invalid type: '" + obj[ "type" ] + "'." );

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
				employee[ "tips" ] = 0;
				employee[ "comps" ] = 0;

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

				// Check that _id is valid
	 			if( obj[ "_id" ] === undefined || obj[ "_id" ] === "" || !(/^[0-9a-fA-F]{24}$/.test( obj[ "_id" ] ) ) )
				{
					res.statusCode = 400;
					res.end( JSON.stringify( { "response" : "bad _id format" } ) );
					return;
				}

				var employee = {};
				employee[ "_id" ] = new mongo.ObjectId( obj[ "_id" ] );

				deleteEmployee( employee, db, res ); 
			});
		}
		else if( path == "/employees/edit" )
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

	 			// Check that _id field is valid
	 			if( obj[ "_id" ] === undefined || obj[ "_id" ] === "" || !(/^[0-9a-fA-F]{24}$/.test( obj[ "_id" ] ) ) )
	 			{
					console.log( "Invalid _id value '" + obj[ "_id" ] + "'." );

					res.statusCode = 400;
					res.end( JSON.stringify( { "success" : "no" } ) );
					return;
	 			}

				// Check to make sure that there is at least one field
				if( ( obj[ "first" ] === undefined || obj[ "first" ] === "" ) &&
					( obj[ "middle" ] === undefined || obj[ "middle" ] === "" ) &&
					( obj[ "last" ] === undefined || obj[ "middle" ] === "" ) &&
					( obj[ "type" ] === undefined || obj[ "type" ] === "" ) )
				{
					console.log( "All fields are empty." );

					res.statusCode = 400;
					res.end( JSON.stringify( { "response" : "all fields are empty. nothing to update" } ) );
					return;
				}

	 			// Create updated employee object with just _id
				var employee = {};
				employee[ "_id" ] = obj[ "_id" ];

				// If first name exists, add to updated list
				if( obj[ "first" ] !== undefined && obj[ "first" ] !== "" )
					employee[ "first" ] = obj[ "first" ];

				// If middle name exists, add to updated list
				if( obj[ "middle" ] !== undefined )
					employee[ "middle" ] = obj[ "middle" ];

				// If last name exists, add to updated list
				if( obj[ "last" ] !== undefined && obj[ "last" ] !== "" )
					employee[ "last" ] = obj[ "last" ];

				// If type exists, add to updated list
				if( obj[ "type" ] !== undefined && obj[ "type" ] !== ""  )
				{
					// Check if type is invalid value
					if( obj[ "type" ] !== "server" && obj[ "type" ] !== "manager" ) 
					{
						console.log( "Invalid type '" + obj[ "type" ] + "'." );

						res.statusCode = 400;
						res.end( JSON.stringify( { "response" : "invalid type" } ) );
						return;
					}

					employee[ "type" ] = obj[ "type" ];
				}

				console.log( "Employee to update information: " + JSON.stringify( employee ) );
				editEmployee( employee, collection, res );
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

	 			// Check that _id field is valid
	 			if( obj[ "_id" ] === undefined || obj[ "_id" ] === "" || !(/^[0-9a-fA-F]{24}$/.test( obj[ "_id" ] ) ) )
	 			{
					console.log( "Invalid _id value '" + obj[ "_id" ] + "'." );

					res.statusCode = 400;
					res.end( JSON.stringify( { "success" : "no" } ) );
					return;
	 			}

				// Check that pin is valid
	 			if( obj[ "pin" ] === undefined || obj[ "pin" ] === ""  )
	 			{
					console.log( "Invalid pin value '" + obj[ "pin" ] + "'." );

					res.statusCode = 400;
					res.end( JSON.stringify( { "success" : "no" } ) );
					return;
	 			}

	 			// Ensure JSON object only has _id and pin fields
	 			var employee = {}
	 			employee[ "_id" ] = new mongo.ObjectId( obj[ "_id" ] );
				employee[ "pin" ] = obj[ "pin" ];

	 			// Update status
	 			findEmployee( employee, db, res );
	 		});
		}
		else if( path == "/employees/logout" )
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
	 			if( obj[ "_id" ] === undefined || obj[ "_id" ] === "" || !(/^[0-9a-fA-F]{24}$/.test( obj[ "_id" ] ) ) )
	 			{
					console.log( "Invalid _id value '" + obj[ "_id" ] + "'." );

					res.statusCode = 400;
					res.end( JSON.stringify( { "success" : "no" } ) );
					return;
	 			}

				// Check that pin is valid
	 			if( obj[ "pin" ] === undefined || obj[ "pin" ] === ""  )
	 			{
					console.log( "Invalid pin value '" + obj[ "pin" ] + "'." );

					res.statusCode = 400;
					res.end( JSON.stringify( { "success" : "no" } ) );
					return;
	 			}

	 			// Ensure JSON object only has _id and pin fields
	 			var employee = {}
	 			employee[ "_id" ] = new mongo.ObjectId( obj[ "_id" ] );
				employee[ "pin" ] = obj[ "pin" ];

	 			// Update status
	 			logout( employee, db, res );
	 		});
		}
		else if( path == "/employees/shift/create" )
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
	 			if( obj[ "_id" ] === undefined || obj[ "_id" ] === "" || !(/^[0-9a-fA-F]{24}$/.test( obj[ "_id" ] ) ) )
	 			{
					console.log( "Invalid _id value '" + obj[ "_id" ] + "'." );

					res.statusCode = 400;
					res.end( JSON.stringify( { "response" : "invalid _id" } ) );
					return;
	 			}

	 			// Check that date is valid
	 			if( obj[ "date" ] === undefined || obj[ "date" ] === "" || 
	 				!( /[0-9]{4}-[0-9]{2}-[0-9]{2}/.test( obj[ "date" ] ) ) )
	 			{
	 				console.log( "Invalid date value '" + obj[ "date" ] + "'." );

					res.statusCode = 400;
					res.end( JSON.stringify( { "response" : "invalid date" } ) );
					return;
	 			}

	 			// Check that start time is valid
	 			if( obj[ "start" ] === undefined || obj[ "start" ] === "" || 
	 				!( /[0-9]{2}:[0-9]{2}/.test( obj[ "start" ] ) ) )
	 			{
	 				console.log( "Invalid start time value '" + obj[ "start" ] + "'." );

					res.statusCode = 400;
					res.end( JSON.stringify( { "response" : "invalid start time" } ) );
					return;
	 			}

	 			// Check that end time is valid
	 			if( obj[ "end" ] === undefined || obj[ "end" ] === "" || 
	 				!( /[0-9]{2}:[0-9]{2}/.test( obj[ "end" ] ) ) )
	 			{
	 				console.log( "Invalid end time value '" + obj[ "end" ] + "'." );

					res.statusCode = 400;
					res.end( JSON.stringify( { "response" : "invalid end time" } ) );
					return;
	 			}

	 			// Create shift object
	 			shift = {};
	 			shift[ "date" ] = obj[ "date" ];
	 			shift[ "start" ] = obj[ "start" ];
	 			shift[ "end" ] = obj[ "end" ];

	 			// Call function to add shift given employee ID and shift object
	 			addShift( { "_id" : new mongo.ObjectId( obj[ "_id" ] ) }, shift, collection, res );
	 		});
		}
		else if( path == "/employees/shift/remove" )
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
	 			if( obj[ "_id" ] === undefined || obj[ "_id" ] === "" || !(/^[0-9a-fA-F]{24}$/.test( obj[ "_id" ] ) ) )
	 			{
					console.log( "Invalid _id value '" + obj[ "_id" ] + "'." );

					res.statusCode = 400;
					res.end( JSON.stringify( { "response" : "invalid _id" } ) );
					return;
	 			}

	 			// Check that date is valid
	 			if( obj[ "date" ] === undefined || obj[ "date" ] === "" || 
	 				!( /[0-9]{4}-[0-9]{2}-[0-9]{2}/.test( obj[ "date" ] ) ) )
	 			{
	 				console.log( "Invalid date value '" + obj[ "date" ] + "'." );

					res.statusCode = 400;
					res.end( JSON.stringify( { "response" : "invalid date" } ) );
					return;
	 			}

	 			// Check that start time is valid
	 			if( obj[ "start" ] === undefined || obj[ "start" ] === "" || 
	 				!( /[0-9]{2}:[0-9]{2}/.test( obj[ "start" ] ) ) )
	 			{
	 				console.log( "Invalid start time value '" + obj[ "start" ] + "'." );

					res.statusCode = 400;
					res.end( JSON.stringify( { "response" : "invalid start time" } ) );
					return;
	 			}

	 			// Check that end time is valid
	 			if( obj[ "end" ] === undefined || obj[ "end" ] === "" || 
	 				!( /[0-9]{2}:[0-9]{2}/.test( obj[ "end" ] ) ) )
	 			{
	 				console.log( "Invalid end time value '" + obj[ "end" ] + "'." );

					res.statusCode = 400;
					res.end( JSON.stringify( { "response" : "invalid end time" } ) );
					return;
	 			}

	 			// Create shift object
	 			shift = {};
	 			shift[ "date" ] = obj[ "date" ];
	 			shift[ "start" ] = obj[ "start" ];
	 			shift[ "end" ] = obj[ "end" ];

	 			// Call function to remove shift given employee ID and shift object
	 			removeShift( { "_id" : new mongo.ObjectId( obj[ "_id" ] ) }, shift, collection, res );
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

function viewEmployees( collection, res )
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

 		// Display debugging output
		console.log( "Items found in employee database:\n" + JSON.stringify( result ) + "\n\n" );

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
 			return;
 		} 

 		// Display new item for debugging
 		console.log( "Inserted Employee: " + JSON.stringify( result.ops[ 0 ] ) );

 		// Send the new item back
 		res.end( JSON.stringify( result.ops[ 0 ] ) );
 	} );
}

async function findEmployee( query, db, res )
{
	console.log( "Employee attempting login:\n    _id: " + query[ "_id" ] + "\n    pin: " + query[ "pin" ] + "\n" );

	var employee;
	var loginReturn;

	try
	{
		employee = await getItem( query, db.db( "restaurant" ).collection( "employees" ) );

		if( employee === null )
		{
			console.log( "Unable to verify employee." );

			res.statusCode = 200;
			res.end( JSON.stringify( { "response" : "unable to verify employee" } ) );
			return;
		}

		// Update employee to logged in
		var update = { $set : { "loggedIn" : 1 } };							// Set the loggedIn attribute to 1
		var options = { returnOriginal: false, returnNewDocument: true };	// Return the updated document
		loginReturn = await editItem( query, update, options, db.db( "restaurant" ).collection( "employees" ) );

		console.log( "Successful login update: " + JSON.stringify( loginReturn.value ) );

		// Only assign tables to servers
		if( employee[ "type" ] === "server" )
		{
			var assignResult = await assignServers( db );
			if( assignResult === null )
				return;
		}
	}
	catch( e )
	{
		console.log( "Fatal error verifying employee.\nError log: " + e.message );

		res.statusCode = 500;
		res.end( JSON.stringify( { "response" : "fatal error verifying employee" } ) );
		return;
	}

	res.end( JSON.stringify( loginReturn.value ) );
}

async function logout( query, db, res )
{
	console.log( "Employee attempting logout:\n    _id: " + query[ "_id" ] + "\n    pin: " + query[ "pin" ] + "\n" );

	var employee;
	var logoutReturn;

	try
	{
		employee = await getItem( query, db.db( "restaurant" ).collection( "employees" ) );

		if( employee === null )
		{
			console.log( "Unable to verify employee." );

			res.statusCode = 200;
			res.end( JSON.stringify( { "response" : "unable to verify employee" } ) );
			return;
		}

		// Update employee to logged in
		var update = { $set : { "loggedIn" : 0 } };							// Set the loggedIn attribute to 0
		var options = { returnOriginal: false, returnNewDocument: true };	// Return the updated document
		logoutReturn = await editItem( query, update, options, db.db( "restaurant" ).collection( "employees" ) );

		console.log( "Successful logout update: " + JSON.stringify( logoutReturn.value ) );

		// Only assign tables to servers
		if( employee[ "type" ] === "server" )
		{
			var assignResult = await assignServers( db );
			if( assignResult === null )
				return;
		}
	}
	catch( e )
	{
		console.log( "Fatal error verifying employee.\nError log: " + e.message );

		res.statusCode = 500;
		res.end( JSON.stringify( { "response" : "fatal error verifying employee" } ) );
		return;
	}

	res.end( JSON.stringify( employee ) );
}

async function assignServers( db )
{
	try
	{
		// Get number of employees logged in
		var employeeListQuery = { "loggedIn" : 1, "type" : "server" };	// Only assign logged in servers to tables
		var options = {};						// No options
		var employeesLoggedIn = await getItems( employeeListQuery, options, db.db( "restaurant" ).collection( "employees" ) );

		// Get number of tables (in case it's not the expected 20
		countQuery = {};
		options = {};
		var numTables = await countItems( countQuery, options, db.db( "restaurant" ).collection( "tables" ) );
		console.log( "Count of logged in employees, tables: " + employeesLoggedIn.length + ", " + numTables + "." );

		// Assign employees to tables equally
		var numTablesPerEmployee = numTables / employeesLoggedIn.length;
		if( numTablesPerEmployee === 0 ) numTablesPerEmployee = 1;
		var i;
		for( i = 0; i < numTables; i++ )
		{
			var employeeNum = parseInt( i / numTablesPerEmployee );

			// Assigning employee to table i
			try
			{
				var query = {};
				query[ "table" ] = i + 1;
				var update = {};
				update[ "$set" ] = {};
				update[ "$set" ][ "server" ] = employeesLoggedIn[ employeeNum ][ "_id" ];
				var options = { returnOriginal : false, returnNewDocument : true };

				console.log( "Assigning employee " + JSON.stringify( update ) + " to table " + JSON.stringify( query ) );

				var updateTableResponse = await editItem( query, update, options, db.db( "restaurant" ).collection( "tables" ) );

				if( updateTableResponse.value === null )
				{
					console.log( "Unable to update table server." );

					res.statusCode = 500;
					res.end( JSON.stringify( { "response" : "unable to update table server assignment" } ) );
					return;
				}

				console.log( "    Update Table Response: " + JSON.stringify( updateTableResponse.value ) + "\n " );
			}
			catch( e )
			{
				console.log( "Fatal error assigning employee to table.\nError log: " + e.message );

				res.statusCode = 500;
				res.end( JSON.stringify( { "response" : "fatal error assigning employee to table" } ) );
				return;
			}
		}
	}
	catch( e )
	{
		console.log( "Fatal error assigning servers.\nError log: " + e.message );

		res.statusCode = 500;
		res.end( JSON.stringify( { "response" : "fatal error assigning servers" } ) );
		return null;
	}
}

async function editEmployee( employee, collection, res )
{
	var employeeEditResponse;

	try
	{
		var query = {};
		query[ "_id" ] = mongo.ObjectId( employee[ "_id" ] );
		var update = {};
		update[ "$set" ] = {};

		if( employee[ "first" ] !== undefined )
			update[ "$set" ][ "first" ] = employee[ "first" ];

		// If middle name is sent, update it. Otherwise unset it
		if( employee[ "middle" ] !== undefined && employee[ "middle" ] !== "" )
			update[ "$set" ][ "middle" ] = employee[ "middle" ];
		else
		 	update[ "$unset" ] = { "middle" : "" };


		if( employee[ "last" ] !== undefined )
			update[ "$set" ][ "last" ] = employee[ "last" ];

		if( employee[ "type" ] !== undefined )
			update[ "$set" ][ "type" ] = employee[ "type" ];

		var options = { returnOriginal : false, returnNewDocument : true };
		console.log( "Employee edit query:  " + JSON.stringify( query ) );
		console.log( "Employee edit update: " + JSON.stringify( update ) );
		console.log( "Employee edit options: " + JSON.stringify( options ) );

		employeeEditResponse = await editItem( query, update, options, collection ); 
		console.log( "Update employee response: " + JSON.stringify( employeeEditResponse ) );
		if( employeeEditResponse.value === null )
		{
			console.log( "Unable to find employee." );

			res.statusCode = 400;
			res.end( JSON.stringify( { "response" : "unable to find employee" } ) );
			return;
		}
	}
	catch( e )
	{
		console.log( "Fatal error when editing employee.\nError log: " + e.message );

		res.statusCode = 500;
		res.end( JSON.stringify( { "response" : "fatal error when editing employee" } ) );
		return;
	}
	console.log( "Updated employee: " + JSON.stringify( employeeEditResponse ) );
	res.end( JSON.stringify( employeeEditResponse.value ) );
}

async function getItem( query, collection )
{
	return collection.findOne( query );
}

async function editItem( query, update, options, collection )
{
	return collection.findOneAndUpdate( query, update, options );
}

async function countItems( query, options, collection )
{
	return collection.countDocuments( query, options );
}

async function getItems( query, options, collection )
{
	return collection.find( query, options ).toArray();
}

function deleteEmployee( deleteItem, db, res )
{
	console.log( "Attempting to delete employee: " + JSON.stringify( deleteItem ) );

	db.db( "restaurant" ).collection( "employees" ).deleteOne( deleteItem, function( err, result ) {
		if( err )
		{
			console.log( "Error deleting employee." );
			res.statusCode = 500;														// Internal Server Error
			res.end( JSON.stringify( { "response" : "error deleting employee" } ) );	// Unsuccessful action
			throw err;
		}

 		// Display deleted result for debugging
 		console.log( "Deleted Employee: " + JSON.stringify( result ) );

 		// await assignServers( db );

 		// Send deleted result back
 		res.end( JSON.stringify( result.result ) );
	} );
}

function addShift( employeeID, shift, collection, res )
{
	collection.findOneAndUpdate( employeeID, { $addToSet : { "shifts" : shift } }, { returnOriginal: false, returnNewDocument: true }, function( err, result ) {
		if( err )
		{
			console.log( "Unable to add shift to employee " + employeeID[ "_id" ] + "." );

			res.statusCode = 500;
			res.end( JSON.stringify( { "response" : "unable to add shift" } ) );
			throw err;
			return;
		}
		
		// Display updated item for debugging
 		console.log( "Updated employee: " + JSON.stringify( result.value ) ); 

		// Send the updated item back
		res.end( JSON.stringify( result.value ) );
	});
}

function removeShift( employeeID, shift, collection, res )
{
	collection.findOneAndUpdate( employeeID, { $pull : { "shifts" : shift } }, { returnOriginal: false, returnNewDocument: true }, function( err, result ) {
		if( err )
		{
			console.log( "Unable to remove shift from employee " + employeeID[ "_id" ] + "." );

			res.statusCode = 500;
			res.end( JSON.stringify( { "response" : "unable to remove shift" } ) );
			throw err;
			return;
		}
		
		// Display updated item for debugging
 		console.log( "Updated employee: " + JSON.stringify( result.value ) ); 

		// Send the updated item back
		res.end( JSON.stringify( result.value ) );
	});
}


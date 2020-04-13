const http = require( 'http' );
const url = require( 'url' );
const fs = require( 'fs' );
const formidable = require( 'formidable' );

const hostname = 'localhost';
const port = 3010;

const server = http.createServer( ( req, res ) =>  {
	var date = new Date().toISOString().substr( 11, 8 );
	console.log( " \n \n \n(" + date  + "): " );


	res.statusCode = 200;
	res.setHeader( 'Content-Type', 'application/json' );
	res.setHeader( 'Access-Control-Allow-Origin', '*' );

	// Get URL path
	var url_parts = url.parse( req.url, true );
	var path  = url_parts.pathname;
	var query = url_parts.query;

	console.log( "Uploading File" );
	var form = new formidable.IncomingForm();
	form.parse( req, function( err, fields, files ) {
		if( err )
		{
			res.statusCode = 500;
			res.end( JSON.stringify( { "response" : "unable to parse form data" } ) );
			console.log( "Unable to parse form data." );
			throw err;
			return;
		}

		// Make sure a file is attached
		if( files[ "fileToUpload" ] === undefined )
		{
			console.log( "No file uploaded." );
			res.statusCode = 400;
			res.end( JSON.stringify( { "response" : "no file uploaded" } ) );
			return;
		}

		// Create file on server
		var oldpath = files.fileToUpload.path;
		var newpath = '/var/www/html/img/' + files.fileToUpload.name;

		fs.rename( oldpath, newpath, function( err ) {
			if( err )
			{
				res.statusCode = 500;
				res.end( JSON.stringify( { "response" : "unable to save file to server" } ) );
				throw err;
				return;
			}
			
			console.log( "New file uploaded to location 'img/" + files.fileToUpload.name + "'." );
			var response = {};
			response[ "location" ] = "http://64.225.29.130/img/" + files.fileToUpload.name;
			res.end( JSON.stringify( response ) );
		} );
	} );

});

server.listen( port, hostname, () => {
	// Display time to log for debugging
	var date = new Date().toISOString().substr( 11, 8 );
	console.log(  "(" + date + "): " ); 
});

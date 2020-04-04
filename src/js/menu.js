function getMenu()
{
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) 
		{
			var doc = document.getElementById( 'textarea-menu-view' );
		
			// Response is a JSON array of items
			var obj = JSON.parse( this.responseText );
			
			var numItems = Object.keys( obj ).length;
			doc.innerHTML = "Number of Menu Items: " + numItems + "\n";

			doc.innerHTML = this.responseText;

			// var i;
			// for( i = 0; i < numItems; i++ )
			// {
			// 	var currItem = obj[ i ];
			// 	doc.innerHTML += 	"Item " + ( i + 1 ) + "\n" + 
			// 						"    Name:  " + currItem.name + "\n" + 
			// 						"    Count: " + currItem.count + "\n\n";
			// }
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Request inventory status response: " + this.status );
		}
	};

	// Send a GET request to 64.225.29.130/inventory/view
	xmlHttp.open( "GET", "http://64.225.29.130/menu/view", true );
	xmlHttp.send();
}


function createMenuItem()
{
	var blobFile = $( "#menu-item-create-picture" )[ 0 ].files[ 0 ];
	var formData = new FormData();
	formData.append( "fileToUpload", blobFile );

	$.ajax( {
		url: "http:64.225.29.130/menu/create",
		type: "POST",
		data: formData,
		processData: false,
		contentType: false,
		success: function( response )
		{
			console.log( response );
		},

		error: function( jqXHR, textStatus, errorMessage ) {
			console.log( errorMessage );
		}
	} );
}

function createMenuItemSubmit()
{
	createMenuItem();

	return false;
}
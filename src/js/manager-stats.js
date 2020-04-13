function viewStats()
{


	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 )
		{
            var obj = JSON.parse(this.responseText);
            obj.forEach(function (d){
                getStats(d.name);
            });
			console.log( this.responseText );
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Create menu item status response: " + this.status );
		}
	};

	// Send a POST request to 64.225.29.130/menu/create
	xmlHttp.open( "GET", "http://64.225.29.130/menu/view",true );
	xmlHttp.send();
}

function getStats(name)
{
	var params = {};
	params[ "name" ] =  name;

	var xmlHttp = new XMLHttpRequest();

	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 )
		{
			console.log( this.responseText );

			var doc = document.getElementById( 'textarea-menu-search-stats' );

			// Response is a JSON object
			var item = JSON.parse( this.responseText );
			doc.innerHTML += "<p class=\"menu-box\">";
			for( var attr in item )
			{
				if( attr === "name" )
				{
					// Get number of different days item has been ordered on
					// Each date is a key, there are 2 extra keys (_id and name)
					var numDates = Object.keys( item ).length - 2;
					doc.innerHTML += item[ "name" ] + ":\n    Ordered on " + numDates + " different days.";
				}
				else if(attr !="_id")
				{
					doc.innerHTML += "        " + attr + ": " + item[ attr ];
				}
			}
			doc.innerHTML += "</p>";
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			document.getElementById( 'textarea-menu-search-stats' ).innerHTML = "Search for menu item stats status response: " + this.status;
			console.log( "Search for menu item stats status response: " + this.status );
		}
	};

	// Send a POST request to 64.225.29.130/inventory/create with selected parameters in key-value format
	xmlHttp.open( "POST", "http://64.225.29.130/menu/stats", true );
	console.log( "Sending: " + JSON.stringify( params ) );
	xmlHttp.send( JSON.stringify( params ) );
}
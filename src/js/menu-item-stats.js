function fetchStats()
{
	$(document).ready(function() {
		var response = communicateWithServer( "", "GET", "http://64.225.29.130/menu/view-available", false );

		if( response.status === 200 )
		{
			// Parse list of menu items into a JSON object
			var obj = JSON.parse( response.responseText );

			// Get the number of menu items
			var numItems = Object.keys( obj ).length;

			// Store the item with the most orders in each category
			var maxItem = {
				"entree" : 		[ -1, -1 ],
				"appetizer" : 	[ -1, -1 ],
				"drink" : 		[ -1, -1 ],
				"dessert" : 	[ -1, -1 ]
			};

			var i;
			for( i = 0; i < numItems; i++ )
			{
				// Get curernt item in menu item list
				var currItem = obj[ i ];

				// Search for statistics
				var query = {};
				query[ "name" ] = currItem[ "name" ];
				var response = communicateWithServer( JSON.stringify( query ), "POST", "http://64.225.29.130/menu/stats", false );

				if( response.status === 200 )
				{
					// Successful response
					// Get item stats object
					var itemStats = JSON.parse( response.responseText );

					// Get string of date
					var date = new Date().toISOString().substring( 0, 10 )

					// Get number of times ordered today
					var timesOrdered = itemStats[ date ];
					console.log( itemStats[ "name" ] + " ordered " + itemStats[ date ] + " times today (" + date + ")." );

					// Check if item is most ordered in its category
					if( maxItem[ currItem[ "category" ] ][ 1 ] < timesOrdered )
					{
						maxItem[ currItem[ "category" ] ][ 0 ] = i;				// Save index of most ordered item
						maxItem[ currItem[ "category" ] ][ 1 ] = timesOrdered;	// Save number of times item has ben ordered
					}
				}
				else
				{
					// Fail response
					console.log( "Unable to get stats for item '" + query[ "name" ] + "'." );
				}
			} 

			console.log( JSON.stringify( maxItem ) );
			sessionStorage.setItem( 'max', JSON.stringify( maxItem ) );
		}
		else
		{
			console.log( "Request inventory status response: " + response.status );
		}
	});
}

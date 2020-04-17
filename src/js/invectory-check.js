function getInventoryList()
{
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) 
		{
			var doc = document.getElementById( 'textarea-view' );
		
			// Response is a JSON array of items
            var obj = JSON.parse( this.responseText );
            			
			var numItems = Object.keys( obj ).length;

            var newInv = new Object();
			var i;
			for( i = 0; i < numItems; i++ )
			{
                newInv [obj[i].name] = obj[i].count;
				var currItem = obj[ i ];
			}

            console.log(newInv);
            window.localStorage.setItem('inventory', JSON.stringify(newInv));
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Request inventory status response: " + this.status );
		}
	};

	// Send a GET request to 64.225.29.130/inventory/view
	xmlHttp.open( "GET", "http://64.225.29.130/inventory/view", true );
	xmlHttp.send();
}

module.exports = {getInventoryList} ;
function menuItemStats(name, loc, type, firstCheck)
{
	var params = {};
	params[ "name" ] =  name;

    var xmlHttp = new XMLHttpRequest();
    
    var sum=0;

    // clearing old max
    var tempMax = {};
    if (firstCheck) {
        tempMax ['entree'] = [-1, -1];
        tempMax ['appetizer'] = [-1, -1];
        tempMax ['drink'] = [-1, -1];
		tempMax ['dessert'] = [-1, -1];
		tempMax ['kid'] = [-1, -1];
		tempMax ['five'] = [-1, -1];
        sessionStorage.setItem('tempMax', JSON.stringify(tempMax));
    }

	// Send a POST request to 64.225.29.130/inventory/create with selected parameters in key-value format
	
    xmlHttp.onreadystatechange = function() {
        if( this.readyState == 4 && this.status == 200 )
		{
			//console.log( this.responseText );

			// Response is a JSON object
            var item = JSON.parse( this.responseText );
            
            var itemDate;
            var dateStr;
            var currentDate = new Date();
            var compare = Infinity;

			for( var attr in item )
			{
				if( attr === "name" )
				{
                    //console.log("Name                 : ", item[attr]), " (", type, ")";
					// Get number of different days item has been ordered on
                    // Each date is a key, there are 2 extra keys (_id and name)
                    sum=0;
				}
				else if ( attr !== "_id")
				{
                    dateStr = attr;
                    dateStr += ' 00:00:00';
                    itemDate = new Date(dateStr);
                    //console.log("Sale date            : ", itemDate);
                    //console.log("Today                : ", currentDate);
                    compare = Math.floor((currentDate-itemDate) / (1000 * 60 * 60 * 24));
                    //console.log("Difference           : ", compare);
                    if (compare < 7) {
                        sum += item[attr];
                        //console.log("sales (", dateStr.substr(0, 10), ") : ", item[attr]);
                    }
                }
            }
            //console.log("total                : ", sum);
			var max = JSON.parse(sessionStorage.getItem('tempMax'));
            if (Number(max [type] [1]) < sum) {
				max [type] = [loc, sum];
				console.log
                sessionStorage.setItem("tempMax", JSON.stringify(max));
            }
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Search for menu item stats status response: " + this.status );
        }
    }
    xmlHttp.open( "POST", "http://64.225.29.130/menu/stats", false );
    xmlHttp.send( JSON.stringify( params ) ); 
    
}

function fetchStats()
{
    $(document).ready(function() {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if( this.readyState == 4 && this.status == 200 )
            {

                // Response is a JSON array of items
                var obj = JSON.parse( this.responseText );

                var numItems = Object.keys( obj ).length;


                var i;
                var j;
                j = 1;
                var firstCheck=true;
                for( i = 0; i < numItems; i++ )
                {
                    var currItem = obj[ i ];
                    menuItemStats(currItem.name, i, currItem.category, firstCheck);
                    firstCheck = false;
                }
                sessionStorage.setItem('max', (sessionStorage.getItem('tempMax')));
            }
            else if( this.readyState == 4 && this.status != 200 )
            {
                console.log( "Request inventory status response: " + this.status );
            }
	    };

        // Send a GET request to 64.225.29.130/inventory/view
        xmlHttp.open( "GET", "http://64.225.29.130/menu/view-available", true );
        xmlHttp.send();
    });
}

// slower version
/*function menuItemStats(name, type, loc, firstCheck)
{
	var params = {};
	params[ "name" ] =  name;

    var xmlHttp = new XMLHttpRequest();
    
    var sum=0;

    // clearing old max
    var tempMax = {};
    tempMax ['sales'] = -1;
    tempMax ['type'] = type;
    console.log(type);
    if (firstCheck) {
        Cookies.set("max", tempMax, {path: '/', sameSite: 'strict'});
    }

	// Send a POST request to 64.225.29.130/inventory/create with selected parameters in key-value format
	xmlHttp.open( "POST", "http://64.225.29.130/menu/stats", false );
	console.log( "Sending: " + JSON.stringify( params ) );
    xmlHttp.send( JSON.stringify( params ) ); 

    if( xmlHttp.readyState == 4 && xmlHttp.status == 200 )
		{
			console.log( xmlHttp.responseText );

			// Response is a JSON object
            var item = JSON.parse( xmlHttp.responseText );
            
            var itemDate;
            var dateStr;
            var currentDate = new Date();
            var compare = Infinity;
            var stat = new Array();

			for( var attr in item )
			{
				if( attr === "name" )
				{
					// Get number of different days item has been ordered on
                    // Each date is a key, there are 2 extra keys (_id and name)
                    sum=0;
				}
				else if ( attr !== "_id")
				{
                    dateStr = attr;
                    dateStr += ' 00:00:00';
                    itemDate = new Date(dateStr);
                    console.log("Sale date            : ", itemDate);
                    console.log("Today                : ", currentDate);
                    compare = Math.floor((currentDate-itemDate) / (1000 * 60 * 60 * 24));
                    console.log("Difference           : ", compare);
                    if (compare < 7) {
                        sum += item[attr];
                        console.log("sales (", dateStr.substr(0, 10), ") : ", item[attr]);
                    }
                }
            }
            console.log("total                : ", sum);
            var max = Cookies.getJSON('max');
            console.log(max);
            if (max == undefined) {
                max = {};
                max ["name"] = item.name;
                max ["sales"] = sum;
                max ["type"] = type;
                max ["loc"] = loc;
                Cookies.set("max", max, {path: '/', sameSite: 'strict'});
            }
            else if (Number(max.sales) < sum) {
                max = {};
                max ["name"] = item.name;
                max ["sales"] = sum;
                max ["type"] = type;
                max ["loc"] = loc;
                Cookies.set("max", max, {path: '/', sameSite: 'strict'});
            }
            console.log(max);
		}
		else if( xmlHttp.readyState == 4 && xmlHttp.status != 200 )
		{
			console.log( "Search for menu item stats status response: " + xmlHttp.status );
        }
        else {
            console.log("nope: ", xmlHttp.status);
        }
    
}*/
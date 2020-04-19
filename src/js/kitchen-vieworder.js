function getOrders()
{
	var params = {}
		params['ready'] = 0;

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) 
		{
			var doc = document.getElementById( 'order-view-area' );
			// console.log( this.responseText );

			// Response is a JSON array of items
			var obj = JSON.parse( this.responseText );
			var numItems = Object.keys( obj ).length;
			var txt="";

			// Skipping reload if nothing has changed
			var cooksOrders = sessionStorage.getItem('cooksOrders');
			sessionStorage.setItem('cooksOrders', JSON.stringify(obj));


			var isItDifferent = false;	// CHANGE THIS BACK TO FALSE WHEN DONE


			if (cooksOrders == null) {
				cooksOrders = obj;
				isItDifferent = true;
			}
			else {
				cooksOrders = JSON.parse(cooksOrders);
				if (cooksOrders.length != obj.length) {
					isItDifferent = true;
				}
				else {
					for (var i=0; i < cooksOrders.length; i++) {
						if (cooksOrders[i]._id != obj[i]._id) {
							isItDifferent = true;
						}
					}
				}
			}

			if (isItDifferent == true) {
				for(i=0; i<numItems; i++)
				{
					var currItem = obj[i];
					var name=[];
					var allergens;
					var notes=[];
					var y=i+1;
					sessionStorage.setItem('btn'+y,"");

					if(currItem.status=='ordered')
					{
						// Create the collapsible button
						txt += "<button type='button' id='btn" + y + "' class='col btn btn-info' data-toggle='collapse' data-target='#order" + y + "'>Order" + y + "</button> ";
						
						// Create the parent div for the order
						txt += "<div id='order" + y + "' class='collapse'>"

						// Create the div for the content
						txt += "<div class='col text-box scrollable'>";

						// Display the table number
						txt+="<p style='text-align: center'>Table:"+currItem.table+"</p>";

						// Display the order notes
						if( currItem.notes != undefined )
						{
							var orderNotes = currItem.notes.replace( /(\n)+/g, '<br>&emsp;&emsp;&emsp;' ) + "<br>";
							txt += "<p>Order Notes:<br>&emsp;&emsp;&emsp;" + orderNotes;
						}

						var numMenuItems = currItem.items.length;

						var j;
						for( j = 0; j < numMenuItems; j++ )
						{
							// Get the current menu item
							var food = currItem.items[ j ];
							txt+="<p>Item " + ( j + 1 ) + ": " + food.name + "</p>";

							// Display ingredients if they are added to the item
							var ingredientNum = 1;
							for( k = 0; k < food.ingredients.length; k++ )
							{
								if( food.hasIngredient[ k ] == 1 )
								{
									txt += "<p>&emsp;Ingredient " + ingredientNum + ": " + food.ingredients[ k ] + "</p>";
									ingredientNum++;
								}
							}

							// Display notes for the menu item
							if( food.notes!=undefined )
							{
								var foodNotes = food.notes.replace( /(\n)+/g, '<br>&emsp;&emsp;&emsp;' ) + "<br>"

								txt += "<p>&emsp;Notes:<br>&emsp;&emsp;&emsp;" + foodNotes + "</p>";
							}
						}

						sessionStorage.setItem('btn'+y,currItem._id);

						// Add notify server button
						txt += "</div><button type=\"button\" value=\"Notify Server\" onclick=\"findTable("+currItem.table+")\">Notify Server</button>";
						
						// Add mark as complete button
						txt += "<button type=\"button\" style=\"background-color:lightgreen;\" value=\"Notify Server\" onclick=\"changeColor("+y+");changeStatus(" + y + "," + currItem.table + ")\">Mark-Complete</button></div><div style=\"background-color:black;font-size:3px\">-</div> ";
					}
				}
				doc.innerHTML=txt;
			}
			
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Rewards accounts inventory status response: " + this.status );
		}
	};

	// Send a GET request to 64.225.29.130/inventory/view
    xmlHttp.open( "POST", "http://64.225.29.130/orders/get", true );
	xmlHttp.send(JSON.stringify(params));
	setTimeout(getOrders,5000);
}

function sendMessage(server)
{
	var params = {};
	params['srcType']="kitchen";
	params['dest']=server;
	params['destType']="server";
	params['request']="help";

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) 
		{
			console.log( this.responseText );
		
			// Response is a JSON array of items
			var obj = JSON.parse( this.responseText );
			var numItems = Object.keys( obj ).length;

			alert("Server "+server+" was notified");
			console.log( this.responseText );
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Send Message response: " + this.status );
		}
	};

	// Send a POST request to 64.225.29.130/messages/send
    xmlHttp.open( "POST", "http://64.225.29.130/messages/send", true );
	xmlHttp.send(JSON.stringify(params));
}

function findTable(table)
{
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) 
		{
			console.log( this.responseText );
		
			// Response is a JSON array of items
			var obj = JSON.parse( this.responseText );
			var numItems = Object.keys( obj ).length;
			obj.forEach(function(item)
			{
				if(item.table==table)
				{
					sendMessage(item.server);
					return(false);
				}
			});
			
			console.log( this.responseText );
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Rewards accounts inventory status response: " + this.status );
		}
	};

	// Send a GET request to 64.225.29.130/tables/view
    xmlHttp.open( "GET", "http://64.225.29.130/tables/view", true );
	xmlHttp.send();
}

function changeColor(number)
{
	var btn="btn"+number;
	if(document.getElementById(btn).style.backgroundColor=="green")
	{
		document.getElementById(btn).style.backgroundColor="#ffc107";
	}
	else
	{
		document.getElementById(btn).style.backgroundColor="green";
	}
}

function managerSearch()
{
	var query = {
		"type" : "manager",
		"loggedIn" : 1
	};

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) 
		{
			console.log( this.responseText );
		
			// Response is a JSON array of items
			var obj = JSON.parse( this.responseText );

			var numItems = Object.keys( obj ).length;

			// Using for loop instead of foreach because it's cheaper
			var i;
			for( i = 0; i < numItems; i++ )
			{
				var employee = obj[ i ];
				help( employee[ "_id" ] );
				alert( employee[ "first" ] + " " + employee[ "last" ] + " (" + employee[ "type" ] + ") was notified" );
			}
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Get employees status response: " + this.status );
		}
	};

	// Send a GET request to 64.225.29.130/inventory/view
    xmlHttp.open( "POST", "http://64.225.29.130/employees/get", true );
	xmlHttp.send( JSON.stringify( query ) );
}

function help(managerid)
{
	var params = {}
		params['src']="";
		params['srcType']='kitchen';
		params['dest']=managerid;
		params['destType']='manager';
		params['request']='help';

		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function() {
			if( this.readyState == 4 && this.status == 200 ) 
			{
	//			var doc = document.getElementById( 'order-view-area' );
	
				console.log( this.responseText );
			
				// Response is a JSON array of items
				var obj = JSON.parse( this.responseText );
				var numItems = Object.keys( obj ).length;
	
				console.log( this.responseText );
			}
			else if( this.readyState == 4 && this.status != 200 )
			{
	//			document.getElementById( 'textarea-orders-view' ).innerHTML = "Rewards accounts inventory status response: " + this.status;
				console.log( "Rewards accounts inventory status response: " + this.status );
			}
		};
	
		// Send a GET request to 64.225.29.130/inventory/view
		xmlHttp.open( "POST", "http://64.225.29.130/messages/send", true );
		xmlHttp.send(JSON.stringify(params));
}

function changeStatus(count, table)
{
	var ide=sessionStorage.getItem('btn'+count);
	sessionStorage.setItem('btn'+count,"");
	var params = {};
		params['_id'] = ide;
		params ['status'] = 'complete';

		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function() {
			if( this.readyState == 4 && this.status == 200 ) 
			{
				console.log( this.responseText );

				// Get server id
				var query = {};
				query[ "table" ] = table;
				var method = "POST";
				var url = "http://64.225.29.130/tables/search";
				var asynchronous = false;

				var response = communicateWithServer( JSON.stringify( query ), method, url, asynchronous );

				console.log( response.responseText );

				// Send complete message to server
				var query = {};
				query[ "src" ] = "";
				query[ "srcType" ] = "kitchen";
				query[ "dest" ] = JSON.parse( response.responseText )[ "server" ];
				query[ "destType" ] = "server";
				query[ "request" ] = "Kitchen has marked order for table " + table + " as complete.";

				var method = "POST";
				var url = "http://64.225.29.130/messages/send";
				var asynchronous = false;

				var response = communicateWithServer( JSON.stringify( query ), method, url, asynchronous );

				console.log( "Response: " + response.responseText );
			}
			else if( this.readyState == 4 && this.status != 200 )
			{
				console.log( "Change order status response: " + this.status );
			}
		};
	
		// Send a GET request to 64.225.29.130/orders/status
		xmlHttp.open( "POST", "http://64.225.29.130/orders/status", true );
		xmlHttp.send(JSON.stringify(params));
}

module.exports = {changeStatus, help, managerSearch, changeColor, findTable, sendMessage, getOrders} ;
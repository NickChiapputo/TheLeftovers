function getOrders()
{
	var params = {}
		params['ready'] = 0;

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) 
		{
			var doc = document.getElementById( 'order-view-area' );

			console.log( this.responseText );

			// Response is a JSON array of items
			var obj = JSON.parse( this.responseText );
			var numItems = Object.keys( obj ).length;
			var txt="";

			// Skipping reload if nothing has changed
			var cooksOrders = sessionStorage.getItem('cooksOrders');
			sessionStorage.setItem('cooksOrders', JSON.stringify(obj));


			var isItDifferent = true;	// CHANGE THIS BACK TO FALSE WHEN DONE


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
					console.log( "\n\nCurrent Item: " + JSON.stringify( currItem ) + "\n\n" );
					var name=[];
					var allergens;
					var notes=[];
					var y=i+1;
					localStorage.setItem('btn'+y,"");
					if(currItem.status=='ordered')
					{
						txt+="<button type=\"button\" id=\"btn"+y+"\" class=\"col btn btn-info\" data-toggle=\"collapse\" data-target=\"#order"+y+"\">Order"+y+"</button> ";
						txt+="<div id=\"order"+y+"\" class=\"collapse\"> <div class=\"col text-box scrollable\">";
						txt+="<p class=\"col-1\">Table:"+currItem.table+"</p>";

						console.log( "\n\nItems: " + JSON.stringify( currItem.items ) + "\n\n" );

						currItem.items.forEach(function (food) {
							var ingredients=[];
							txt+="<p>Name:"+food.name+"</p>";

							for(k=0;k<food.ingredients.length;k++)
							{
								if(food.hasIngredient[k]==1)
								{
									ingredients.push(food.ingredients[k]);
								}
							}
							
							console.log( "\n\nFood: " + JSON.stringify( food ) + "\n\n" );
							if(food.notes!=undefined)
							{
								console.log( "Foode notes: " + food.notes );
								notes.push(food.notes+"<br>");
							}


							if(ingredients.length!=0)
							{
								txt+="<p>Ingredients:"+ingredients.join(",")+"</p>"
							}
						});

						notes.push( currItem.notes );
						
						console.log( "Notes: " + notes );
						if(notes.length!=0)
							txt+="Note:"+notes.join(",");
							var ide = "";
							sessionStorage.setItem('btn'+y,currItem._id);
						txt+="</div><button type=\"button\" value=\"Notify Server\" onclick=\"findTable("+currItem.table+")\">Notify Server</button><button type=\"button\" style=\"background-color:lightgreen;\" value=\"Notify Server\" onclick=\"changeColor("+y+")\">Mark-Complete</button><button type=\"button\" value=\"Notify Server\" style=\"background-color:red\" onclick=\"changeStatus("+y+")\">Clear</div><div style=\"background-color:black;font-size:3px\">-</div> ";
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

function sendMessage(tableid)
{
	var params = {};
	params['srcType']="kitchen";
	params['dest']=tableid;
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

			alert("Server "+tableid+" was notified");
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

function changeStatus(count)
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
		xmlHttp.open( "POST", "http://64.225.29.130/orders/status", true );
		xmlHttp.send(JSON.stringify(params));
}

module.exports = {changeStatus, help, managerSearch, changeColor, findTable, sendMessage, getOrders} ;
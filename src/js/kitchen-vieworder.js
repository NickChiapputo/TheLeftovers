function getOrders()
{
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
			for(i=0; i<numItems; i++)
			{
				var currItem = obj[i];
				var name=[];
				var allergens;
				var y=i+1;
				txt+="<button type=\"button\" id=\"btn"+y+"\" class=\"col btn btn-info\" data-toggle=\"collapse\" data-target=\"#order"+y+"\">Order"+y+"</button> ";
				txt+="<div id=\"order"+y+"\" class=\"collapse\"> <div class=\"col text-box scrollable\">";
				txt+="<p class=\"col-1\">Table:"+currItem.table+"</p>"
				currItem.items.forEach(function (food) {
					var ingredients=[];
					txt+="<p>Name:"+food.name+"</p>";
					food.ingredients.forEach(function (ingredient){
							ingredients.push(ingredient);
					});

					if(ingredients.length!=0)
					{
						txt+="<p>Ingredients:"+ingredients.join(",")+"</p>"
					}
				});
				if(currItem.notes!=undefined)
					txt+="Note:"+currItem.notes;
				txt+="</div><button type=\"button\" value=\"Notify Server\" onclick=\"findTable("+currItem.table+")\">Notify Server</button><button type=\"button\" style=\"background-color:lightgreen;\" value=\"Notify Server\" onclick=\"changeColor("+y+")\">Mark-Complete</button></div><div style=\"background-color:black;font-size:3px\">-</div> ";
			}
			
			console.log( this.responseText );
			doc.innerHTML+=txt;
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			document.getElementById( 'textarea-orders-view' ).innerHTML = "Rewards accounts inventory status response: " + this.status;
			console.log( "Rewards accounts inventory status response: " + this.status );
		}
	};

	// Send a GET request to 64.225.29.130/inventory/view
    xmlHttp.open( "GET", "http://64.225.29.130/orders/view", true );
	xmlHttp.send();

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
//			var doc = document.getElementById( 'order-view-area' );

			console.log( this.responseText );
		
			// Response is a JSON array of items
			var obj = JSON.parse( this.responseText );
			var numItems = Object.keys( obj ).length;

			alert("Server "+tableid+" was notified");
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

function findTable(table)
{

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) 
		{
//			var doc = document.getElementById( 'order-view-area' );

			console.log( this.responseText );
		
			// Response is a JSON array of items
			var obj = JSON.parse( this.responseText );
			var numItems = Object.keys( obj ).length;
			obj.forEach(function(item)
			{
				if(item.table==table)
				{
					
					sendMessage(item._id);
					return(false);
				}
			});
			
			console.log( this.responseText );
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
//			document.getElementById( 'textarea-orders-view' ).innerHTML = "Rewards accounts inventory status response: " + this.status;
			console.log( "Rewards accounts inventory status response: " + this.status );
		}
	};

	// Send a GET request to 64.225.29.130/inventory/view
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
		document.getElementById(btn).style.backgroundColor="green"
	}
}
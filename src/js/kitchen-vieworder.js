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
				txt+="<button type=\"button\" class=\"col btn btn-info\" data-toggle=\"collapse\" data-target=\"#order"+y+"\">Order"+y+"</button> ";
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
				txt+="</div><button type=\"button\" value=\"Notify Server\" onclick=\"alert()\">Notify Server</button></div><div style=\"background-color:black;font-size:3px\">-</div> ";
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

/*Contributed from https://www.w3schools.com/howto/howto_js_collapsible.asp*/
var coll = document.getElementsByClassName("collapsible");
var i;



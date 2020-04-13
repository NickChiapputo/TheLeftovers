function getOrders()
{
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) 
		{
			var doc = document.getElementById( 'textarea-orders-view' );

			console.log( this.responseText );
		
			// Response is a JSON array of items
			var obj = JSON.parse( this.responseText );
            var numItems = Object.keys( obj ).length;
			for(i=0; i<numItems; i++)
			{
				var currItem = obj[i];
				var name=[];
				var allergens;
				var ingredients=[];
				if(currItem.table==1)
				{

				}
				else if(currItem.table==2)
				{

				}
				else if(currItem.table==3)
				{

				}
				else if(currItem.table==4)
				{

				}
				else if(currItem.table==5)
				{

				}
				else if(currItem.table==6)
				{

				}
				else if(currItem.table==7)
				{

				}
				else if(currItem.table==8)
				{

				}
				else if(currItem.table==9)
				{

				}
				else if(currItem.table==10)
				{
					currItem.items.forEach(function (food) {
						doc.innerHTML+="<p>Name:"+food.name+"</p>"
						food.ingredients.forEach(function (ingredient){
							doc.innerHTML+="<p>Ingredients:"+ingredient.name+"</p>"
						});
					});

				}
				else if(currItem.table==11)
				{

				}
				else if(currItem.table==12)
				{

				}
				else if(currItem.table==13)
				{

				}
				else if(currItem.table==14)
				{

				}
				else if(currItem.table==15)
				{

				}
				else if(currItem.table==16)
				{

				}
				else if(currItem.table==17)
				{

				}
				else if(currItem.table==18)
				{

				}
				else if(currItem.table==19)
				{

				}
				else if(currItem.table==20)
				{

				}
			}

			console.log( this.responseText );
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

/*******************************************/
/*       Collapsible Area Functions        */
function collapse( buttonID, elementID )
{
	// Change button to active class
	document.getElementById( buttonID ).classList.toggle( "active" );

	// Get div document
	var el = document.getElementById( elementID );


	/********* USE THIS FOR STATIC/IMMEDIATE COLLAPSING *****/
	// Toggle between open ("block") and closed ("none")
	// if( el.style.display === "block" )
	// {
	// 	el.style.display = "none";
	// }
	// else
	// {
	// 	el.style.display = "block";
	// }


	/********* USE THIS FOR ANIMATED COLLAPSING *****/
	// Animate sliding
	if( el.style.maxHeight )
	{
		el.style.maxHeight = null;
	}
	else
	{
		el.style.maxHeight = el.scrollHeight + "px";
	}
}
/*******************************************/

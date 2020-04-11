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

			var name=[];
			var allergens;
			var ingredients=[];
			var i;
			for( i = 0; i < numItems; i++ )
			{
				var currItem = obj[ i ];
				doc.innerHTML +="<div class=\"row menu-box\">"
				+"<div class=\"col menu-box\" style=\"border:transparent; border-spacing: 15px; border-collapse: separate; \">Table: "
				+currItem.table
				+"<div class=\"row\">"
				+"<div class=\"col text-box\"  style=\"border: transparent; max-height: 40vh; max-width: 40vh;\">"
				+"<div>Name:"+name+"</div>"
				+"<div>Ingredients:"+ingredients+"</div>"
				+"<div>Notes:"+currItem.notes+"</div>"
				+"</div>"
				+"<button style=\"height:min-content;\" onclick=\"gdelete("+currItem.table+")\">Send</button>"
				+"</div>"
				+"</div>"
				+"</div>";
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

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}

function gdelete(name)
{
	alert(name);
}
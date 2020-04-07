const init = function (e)
{
    var foodinfo = document.querySelector("#food-name");
    foodinfo.innerHTML+=localStorage.getItem('food-Item');
    var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) 
		{
			var doc = document.getElementById( 'textarea-menu-view' );
		
			// Response is a JSON array of items
			var obj = JSON.parse( this.responseText );
			
			var numItems = Object.keys( obj ).length;
      
	//		doc.innerHTML = "Number of Menu Items: " + numItems + "\n";

			var i;
			obj.forEach(function(d) {
                if(d.name==localStorage.getItem('food-Item'))
                {
                    doc.innerHTML+= d.name+"    "+"<button id=\"food\" class=\"menu-box\" onclick=\"displayInfo('"+d.name+"');\"><img style=\"width:120px; height:120px; border-radius:50% \" src=\""+d.image+"\"<button>\n";
                }
			});

		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Request inventory status response: " + this.status );
		}
	};

	// Send a GET request to 64.225.29.130/inventory/view
	xmlHttp.open( "GET", "http://64.225.29.130/menu/view", true );
	xmlHttp.send();
};
document.addEventListener('DOMContentLoaded', function()
{
    init();
});
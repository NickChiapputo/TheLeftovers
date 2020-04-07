const init = function (e)
{
	var name = document.querySelector("#food-name");
	var description = document.querySelector("#food-description");
	var pic = document.querySelector("#food-picture");
	var kcal = document.querySelector("#food-kcal");
	var ingredients = document.querySelector("#food-ingredients");
	var allergens = document.querySelector("#food-allergens");
	var price = document.querySelector("#food-price");
	var category = document.querySelector("#food-category");


    var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) 
		{
			// Response is a JSON array of items
			var obj = JSON.parse( this.responseText );
			
			var numItems = Object.keys( obj ).length;
      
	//		doc.innerHTML = "Number of Menu Items: " + numItems + "\n";
			obj.forEach(function(d) {
                if(d.name==localStorage.getItem('food-Item'))
                {
					name.innerHTML+=d.name;
					description.innerHTML+=d.description;
					pic.innerHTML+="<div class=\"item-large-image\" style=\"background-image: url("+d.image+");max-height:70vh;min-height:70vh\"></div>";
					d.ingredients.forEach(function(a){
						ingredients.innerHTML+="<input type=\"checkbox\" id=\"topping\" name=\"topping\" value=\"topping\" checked>";
						ingredients.innerHTML+="<label for=\"topping\">"+a+"</label><br>";

					});
					kcal.innerHTML+="kcal="+d.calories;
					allergens.innerHTML+="Allergens="+d.allergens;
					price.innerHTML+="Price=$"+d.price;
					category.innerHTML+=d.category;

					
					

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
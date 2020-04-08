const init = function (e)
{
	var name = document.querySelector("#food-name");
	var description = document.querySelector("#food-description");
	var pic = document.querySelector("#food-picture");
	var kcal = document.querySelector("#food-kcal");
	var ingredients = document.querySelector("#food-ingredients");
	var allergens = document.querySelector("#food-allergens");
	var price = document.querySelector("#food-price");


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
					for(i=0; i< d.ingredients.length; i++)
					{
						if(d.hasIngredient[i]>0)
						{
							ingredients.innerHTML+="<input type=\"checkbox\" id=\"topping\" name=\"topping\" value=\"topping\" checked>";
							ingredients.innerHTML+="<label for=\"topping\">"+d.ingredients[i]+":"+d.hasIngredient[i]+"</label><br>";
						}
						else
						{
							ingredients.innerHTML+="<input type=\"checkbox\" id=\"topping\" name=\"topping\" value=\"topping\">";
							ingredients.innerHTML+="<label for=\"topping\">"+d.ingredients[i]+"</label><br>";
						}
					}
					kcal.innerHTML+="Cal="+d.calories;
					allergens.innerHTML+="Allergens="+d.allergens;
					price.innerHTML+="Price=$"+d.price;

					
					

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


function deleteMenuItem()
{
	var params = "name=" + document.getElementsByName( "name-menu-delete" )[ 0 ].value;

	var xmlHttp = new XMLHttpRequest();

	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 )
		{
			console.log( this.responseText );

			// Response is a JSON object
			var obj = JSON.parse( this.responseText );

			if( obj == null || obj.ok != 1 || obj.n != 1 )
				document.getElementById( 'textarea-menu-delete' ).innerHTML = "Unable to delete item.\n";
			else
				document.getElementById( 'textarea-menu-delete' ).innerHTML = "Deleted Item\n";
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Create inventory item status response: " + this.status );
		}
	};

	// Send a POST request to 64.225.29.130/inventory/create with selected parameters in key-value format
	xmlHttp.open( "POST", "http://64.225.29.130/menu/delete?" + params, true );
	xmlHttp.send( params );
}

function deleteMenuItemFormSubmit()
{
	deleteMenuItem();

	return false;
}
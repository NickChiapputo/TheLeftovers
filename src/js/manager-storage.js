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
					localStorage.setItem('food-Item-d',d.description);
					localStorage.setItem('food-Item-n',d.name);
					localStorage.setItem('food-Item-i',JSON.stringify(d.ingredients));
					localStorage.setItem('food-Item-cal',d.calories);
					localStorage.setItem('food-Item-a',d.allergens);
					localStorage.setItem('food-Item-p',d.price);
					localStorage.setItem('food-Item-pic',d.image);
					name.innerHTML+=d.name;
					description.innerHTML+=d.description;
					pic.innerHTML+="<div class=\"item-large-image\" style=\"background-image: url("+d.image+");max-height:70vh;min-height:70vh\"></div>";
					for(i=0; i< d.ingredients.length; i++)
					{
						if(d.hasIngredient[i]>0)
						{
							ingredients.innerHTML+="<input type=\"checkbox\" id=\"topping\" name=\"topping\" value=\"topping\" checked>";
							ingredients.innerHTML+="<label for=\"topping\">"+d.ingredients[i]+":"+d.ingredientCount[i]+"</label><br>";
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


function loadIngredients()
{
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) 
		{
			// Response is a JSON array of items
			var obj = JSON.parse( this.responseText );
			
			var numItems = Object.keys( obj ).length;
			var el = document.getElementById( "ingredientLabel" );
			
	//		var elEdit = document.getElementById( "ingredientLabel-edit" );

			var i;
			for( i = 0; i < numItems; i++ )
			{
				var currItem = obj[ i ];

				var ingredientSrc = 
					'<div class="ingredientArea" style="display: table-row;">' + 
						'<div style="display: table-cell;">' + 
							'<div class="labelIngredient" style="">' + 
								currItem.name + 
							'</div>' + 
						'</div>' + 
						'<div style="display: table-cell;">' + 
							'<div style="display: table; table-layout: fixed; width: 25vw; text-align: center;">' + 
								'<div style="display: table-row;">' + 
									'<div style="display: table-cell;">' + 
										'<input style="" type="checkbox" name="menu-item-create-ingredient-' + 
											( i + 1 ) + 
											'" value="' + 
											currItem.name + 
										'" />' + 
									'</div>' + 
									'<div style="display: table-cell;">' + 
										'<input style="" type="checkbox" name="menu-item-create-has-ingredient-' + 
											( i + 1 ) + 
											'" value="' + 
											'1' + 
										'" />' + 
									'</div>' + 
									'<div style="display: table-cell;">' + 
										'<input style="" type="number" size="5" maxlength="3" name="menu-item-create-ingredient-count-' + 
											( i + 1 ) + 
											'" value="' + 
											currItem.name + 
										'" />' + 
									'</div>' + 
								'</div>' + 
							'</div>' + 
						'</div>' + 
					'</div>';

				el.insertAdjacentHTML( 'afterend', ingredientSrc );

			//	elEdit.insertAdjacentHTML( 'afterend', ingredientSrc );
			}
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Request inventory status response: " + this.status );
		}
	};

	// Send a GET request to 64.225.29.130/inventory/view
	xmlHttp.open( "GET", "http://64.225.29.130/inventory/view", true );
	xmlHttp.send();
}

function deleteMenuItem()
{
	window.document.location="./editmenu.html";
	var params = {};
	params[ "name" ] = localStorage.getItem('food-Item');

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
			document.getElementById( 'textarea-menu-delete' ).innerHTML = "Delete menu item status response: " + this.status;
			console.log( "Delete menu item status response: " + this.status );
		}
	};

	// Send a POST request to 64.225.29.130/inventory/create with selected parameters in key-value format
	xmlHttp.open( "POST", "http://64.225.29.130/menu/delete", true );
	console.log( "Sending: " + JSON.stringify( params ) );
	xmlHttp.send( JSON.stringify( params ) ); 
}

function deleteMenuItemFormSubmit()
{
	deleteMenuItem();
	return false;
}

/*
function editMenu()
{
	var name = document.querySelector("#food-name");
	var description = document.querySelector("#food-description");
	var pic = document.querySelector("#food-picture");
	var kcal = document.querySelector("#food-kcal");
	var allergens = document.querySelector("#food-allergens");
	var price = document.querySelector("#food-price");

		name.innerHTML = "";
		description.innerHTML="";
		pic.innerHTML="";
		kcal.innerHTML="";
		allergens.innerHTML="";
		price.innerHTML="";

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
					name.innerHTML+="<input name=\"menu-item-edit-name\" class=\"col\" style=\" height:5vh\" type=\"text\" placeholder=\""+d.name+"\">";
					description.innerHTML+="<input name=\"menu-item-edit-description\" class=\"col\" style=\" height:5vh\" type=\"text\" placeholder=\""+d.description+"\">";
					pic.innerHTML+="<div id=\"menu-item-edit-picture\" style=\"display:table-cell;\"><input type=\"file\" required id=\"menu-item-create-picture\"></div><div class=\"item-large-image\" style=\"background-image: url("+d.image+");max-height:70vh;min-height:70vh\"></div>";
					kcal.innerHTML+="<input  name=\"menu-item-edit-calories\" class=\"col\" style=\" height:5vh\" type=\"text\" placeholder=\"Cal="+d.calories+"\">";
					price.innerHTML+="<input name=\"menu-item-edit-price\" class=\"col\" style=\" height:5vh\" type=\"text\" placeholder=\"Price="+d.price+"\">";
					gatherIngredients();
					allergens.innerHTML+="<div style=\"display: table-row;\">"
					  +"<div style=\"display: table-cell;\">"
						+"<div class=\"label\" style=\"margin-top: 5vh;\">Ham</div>"
					  +"</div>"
					  +"<div style=\"display: table-cell;\">"
						+"<input style=\"width: 5vw;\" type=\"checkbox\" name=\"menu-item-edit-allergens-1\" value=\"ham\" />"
					  +"</div>"
					+"</div>"

					+"<div style=\"display: table-row\">"
					  +"<div style=\"display: table-cell;\">"
						+"<div class=\"label\" style=\"\">Meat</div>"
					  +"</div>"
					  +"<div style=\"display: table-cell;\">"
						+"<input style=\"width: 5vw;\" type=\"checkbox\" name=\"menu-item-edit-allergens-2\" value=\"meat\" />"
					  +"</div>"
					+"</div>"

					+"<div style=\"display: table-row\">"
					  +"<div style=\"display: table-cell;\">"
						+"<div class=\"label\" style=\"\">Dairy</div>"
					  +"</div>"
					  +"<div style=\"display: table-cell;\">"
						+"<input style=\"width: 5vw;\" type=\"checkbox\" name=\"menu-item-edit-allergens-3\" value=\"dairy\" />"
					  +"</div>"
					+"</div>"

					+"<div style=\"display: table-row\">"
					  +"<div style=\"display: table-cell;\">"
						+"<div class=\"label\" style=\"\">Gluten</div>"
					  +"</div>"
					  +"<div style=\"display: table-cell;\">"
						+"<input style=\"width: 5vw;\" type=\"checkbox\" name=\"menu-item-edit-allergens-4\" value=\"gluten\" />"
					  +"</div>"
					+"</div>"

					+"<div style=\"display: table-row\">"
					  +"<div style=\"display: table-cell;\">"
						+"<div class=\"label\" style=\"\">Shellfish</div>"
					  +"</div>"
					  +"<div style=\"display: table-cell;\">"
						+"<input style=\"width: 5vw;\" type=\"checkbox\" name=\"menu-item-edit-allergens-5\" value=\"shellfish\" />"
					  +"</div>"
					+"</div>"

					+"<div style=\"display: table-row\">"
					  +"<div style=\"display: table-cell;\">"
						+"<div class=\"label\" style=\"\">Soy</div>"
					  +"</div>"
					  +"<div style=\"display: table-cell;\">"
						+"<input style=\"width: 5vw;\" type=\"checkbox\" name=\"menu-item-edit-allergens-6\" value=\"soy\" />"
					  +"</div>"
					+"</div>"

					+"<div style=\"display: table-row\">"
					  +"<div style=\"display: table-cell;\">"
						+"<div class=\"label\" style=\"\">Fish</div>"
					  +"</div>"
					  +"<div style=\"display: table-cell;\">"
						+"<input style=\"width: 5vw;\" type=\"checkbox\" name=\"menu-item-edit-allergens-7\" value=\"fish\" />"
					  +"</div>"
					+"</div>"

					+"<div style=\"display: table-row\">"
					  +"<div style=\"display: table-cell;\">"
						+"<div class=\"label\" style=\"\">Nuts</div>"
					  +"</div>"
					  +"<div style=\"display: table-cell;\">"
						+"<input style=\"width: 5vw;\" type=\"checkbox\" name=\"menu-item-edit-allergens-8\" value=\"nuts\" />"
					  +"</div>"
					+"</div>"
				+"</div>";
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

function gatherIngredients()
{
	var ingredients = document.querySelector("#food-ingredients");
	ingredients.innerHTML="";
	ingredients.innerHTML+="<div id=\"ingredientLabel-edit\" class=\"ingredientArea\" style=\"display: table-row;\" id=\"ingredientLabel\">"
	  +"<div style=\"display: table-cell;\">"
		+"<div style=\"display: table; text-align: left;\">"
		  +"<div style=\"display: table-row;\">"
			+"<div style=\"display: table-cell;\">"
			  +"<div class=\"label\" style=\"margin-top: 1vw;\">"
				+"Ingredient"
			  +"</div>"
			+"</div>"
		  +"</div>"
		+"</div>"
	  +"</div>"

	  +"<div style=\"display: table-cell;\">"
		+"<div style=\"display: table;  width: 25vw; text-align: center;\">"
		  +"<div style=\"display: table-row;\">"

			+"<div style=\"display: table-cell; width: 33%;\">"
			  +"<div style=\"\">"
				+"Included"
			  +"</div>"
			+"</div>"

			+"<div style=\"display: table-cell; width: 33%;\">"
			  +"<div style=\"\">"
				+"Default"
			  +"</div>"
			+"</div>"

			+"<div style=\"display: table-cell; width: 33%;\">"
			  +"<div style=\"\">"
				+"Count"
			  +"</div>"
			+"</div>"

		  +"</div>"
		+"</div>"
	  +"</div>"
	+"</div>";
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) 
		{
			// Response is a JSON array of items
			var obj = JSON.parse( this.responseText );
			
			var numItems = Object.keys( obj ).length;
	//		var el = document.getElementById( "ingredientLabel" );
			var elEdit = document.getElementById( "ingredientLabel-edit" );

			var i;
			for( i = 0; i < numItems; i++ )
			{
				var currItem = obj[ i ];

				var ingredientSrc = 
					'<div class="ingredientArea" style="display: table-row;">' + 
						'<div style="display: table-cell;">' + 
							'<div class="labelIngredient" style="">' + 
								currItem.name + 
							'</div>' + 
						'</div>' + 
						'<div style="display: table-cell;">' + 
							'<div style="display: table; table-layout: fixed; width: 25vw; text-align: center;">' + 
								'<div style="display: table-row;">' + 
									'<div style="display: table-cell;">' + 
										'<input style="" type="checkbox" name="menu-item-edit-ingredient-' + 
											( i + 1 ) + 
											'" value="' + 
											currItem.name + 
										'" />' + 
									'</div>' + 
									'<div style="display: table-cell;">' + 
										'<input style="" type="checkbox" name="menu-item-edit-has-ingredient-' + 
											( i + 1 ) + 
											'" value="' + 
											'1' + 
										'" />' + 
									'</div>' + 
									'<div style="display: table-cell;">' + 
										'<input style="" type="number" size="5" maxlength="3" name="menu-item-edit-ingredient-count-' + 
											( i + 1 ) + 
											'" value="' + 
											currItem.name + 
										'" />' + 
									'</div>' + 
								'</div>' + 
							'</div>' + 
						'</div>' + 
					'</div>';

				//el.insertAdjacentHTML( 'afterend', ingredientSrc );

				elEdit.insertAdjacentHTML( 'afterend', ingredientSrc );
			}
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Request inventory status response: " + this.status );
		}
	};

	// Send a GET request to 64.225.29.130/inventory/view
	xmlHttp.open( "GET", "http://64.225.29.130/inventory/view", true );
	xmlHttp.send();
}

function editSubmit()
{
	alert(document.getElementsByName("menu-item-edit-name")[0].value);
}
*/

function createMenuItem()
{
	if(document.getElementsByName("menu-item-create-name").value==undefined)
	{
		document.getElementsByName("menu-item-create-name").value=localStorage.getItem('food-Item-n');

	}
	if(document.getElementsByName("menu-item-create-description").value==undefined)
	{
		document.getElementsByName("menu-item-create-description").value=localStorage.getItem('food-Item-d');
	}
	if(document.getElementsByName("menu-item-create-calories").value==undefined)
	{
		document.getElementsByName("menu-item-create-calories").value=localStorage.getItem('food-Item-cal');
	}
	if(document.getElementsByName("menu-item-create-price").value==undefined)
	{
		document.getElementsByName("menu-item-create-price").value=localStorage.getItem('food-Item-p');
		//alert(document.getElementsByName("menu-item-create-price").value);
	}

	var formData = new FormData( createMenuItemForm );

	if(formData.get("menu-item-create-name")=="")
	{
		formData.set("menu-item-create-name",localStorage.getItem('food-Item-n'));

	}
	if(formData.get("menu-item-create-description")=="")
	{
		formData.set("menu-item-create-description",localStorage.getItem('food-Item-d'));
	}
	if(formData.get("menu-item-create-calories")=="")
	{
		formData.set("menu-item-create-calories",localStorage.getItem('food-Item-cal'));
	}
	if(formData.get("menu-item-create-price")=="")
	{
		formData.set("menu-item-create-price",localStorage.getItem('food-Item-p'));
		//alert(document.getElementsByName("menu-item-create-price").value);
	}
	formData.append( "fileToUpload", document.getElementById( "menu-item-create-picture" ).files[ 0 ] );

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 )
		{
			var obj = JSON.parse( this.responseText );
			var el = document.getElementById( "textarea-menu-create" );

			el.innerHTML = "Item Created:\n";
			for( var attr in obj )
				el.innerHTML += "    " + attr + ": " + obj[ attr ] + "\n";
			console.log( this.responseText );
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Create menu item status response: " + this.status );
		}
	};

	// Send a POST request to 64.225.29.130/menu/create
	xmlHttp.open( "POST", "http://64.225.29.130/menu/create" );
	xmlHttp.send( formData );
}

function createMenuItemSubmit()
{
	deleteMenuItem();
	createMenuItem();
	return false;
}
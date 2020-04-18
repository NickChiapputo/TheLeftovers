const init = function (e)
{
	var name = document.querySelector("#food-name");
	var description = document.querySelector("#food-description");
	var pic = document.querySelector("#food-picture");
	var kcal = document.querySelector("#food-kcal");
	var ingredients = document.querySelector("#food-ingredients");
	var allergens = document.querySelector("#food-allergens");
	var price = document.querySelector("#food-price");

	var params = {};
 		params['name']=sessionStorage.getItem('food-Item');


	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 )
		{
			var obj = JSON.parse( this.responseText );
			var el = document.getElementById( "textarea-menu-create" );
			name.innerHTML = obj.name;
			description.innerHTML = obj.description;
			kcal.innerHTML="Cal=" +obj.calories;
			pic.innerHTML = "<div class=\"item-large-image\" style=\"background-image: url("+obj.image+");max-height:70vh;min-height:70vh\"></div>";
			allergens.innerHTML="Allergens="+obj.allergens;
			price.innerHTML="Price=$"+obj.price;
			sessionStorage.setItem('food-item-name',obj.name);
			sessionStorage.setItem('food-item-description',obj.description);
			sessionStorage.setItem('food-item-calories',obj.calories);
			sessionStorage.setItem('food-item-price',obj.price);
			sessionStorage.setItem('food-item-id',obj._id)
			sessionStorage.setItem('food-item-category',obj.category);
			for(i=0; i< obj.ingredients.length; i++)
			{
				if(obj.hasIngredient[i]!=0)
				{
					ingredients.innerHTML+="<input type=\"checkbox\" id=\"topping\" name=\"topping\" value=\"topping\" checked readOnly>";
					ingredients.innerHTML+="<label>"+obj.ingredients[i]+":"+obj.ingredientCount[i]+"</label><br>";
				}
				else
				{
					ingredients.innerHTML+="<input type=\"checkbox\" id=\"topping\" name=\"topping\" value=\"topping\"readOnly>";
					ingredients.innerHTML+="<label>"+obj.ingredients[i]+":"+obj.ingredientCount[i]+"</label><br>";
				}
			}

			console.log( this.responseText );
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Create menu item status response: " + this.status );
		}
	};

	// Send a POST request to 64.225.29.130/menu/create
	xmlHttp.open( "POST", "http://64.225.29.130/menu/search",true );
	xmlHttp.send( JSON.stringify(params) );
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
			var doc = document.getElementById( 'textarea-view' );
		
			// Response is a JSON array of items
			var obj = JSON.parse( this.responseText );
			
			var numItems = Object.keys( obj ).length;
		//	var el = document.getElementById( "ingredientLabel" );
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

				var ingredientEditSrc = 
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

		//		el.insertAdjacentHTML( 'afterend', ingredientSrc );

				elEdit.insertAdjacentHTML( 'afterend', ingredientEditSrc );
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

function editMenuItem()
{
	var formData = new FormData( editMenuItemForm );
	formData.set("menu-item-edit-id",sessionStorage.getItem('food-item-id'));
	document.getElementsByName("menu-item-edit-id")[0].value=sessionStorage.getItem('food-item-id');
	if(formData.get("menu-item-edit-name")=="")
	{
		formData.set("menu-item-edit-name",sessionStorage.getItem('food-item-name'));
	}
	if(formData.get("menu-item-edit-price")=="")
	{
		formData.set("menu-item-edit-price",sessionStorage.getItem('food-item-price'));
	}
	if(formData.get("menu-item-edit-calories")=="")
	{
		formData.set("menu-item-edit-calories",sessionStorage.getItem('food-item-calories'));
	}
	if(formData.get("menu-item-edit-description")=="")
	{
		formData.set("menu-item-edit-description",sessionStorage.getItem('food-item-description'));
	}
	
	if( document.getElementById( "editMenuItemForm" ).checkValidity() )
	{
		formData.append( "fileToUpload", document.getElementById( "menu-item-edit-picture" ).files[ 0 ] );

		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function() {
			if( this.readyState == 4 && this.status == 200 )
			{
				var obj = JSON.parse( this.responseText );
				var el = document.getElementById( "textarea-menu-edit" );

				el.innerHTML = "Item Edited:\n";
				for( var attr in obj )
					el.innerHTML += "    " + attr + ": " + obj[ attr ] + "\n";
				console.log( this.responseText );
			}
			else if( this.readyState == 4 && this.status != 200 )
			{
				document.getElementById( 'textarea-menu-edit' ).innerHTML = "Edit menu item status response: " + this.status;
				document.getElementById( 'textarea-menu-edit' ).innerHTML += "\n\n" + this.responseText;
				console.log( "Edit menu item status response: " + this.status );
			}
		};

		// Send a POST request to 64.225.29.130/menu/edit
		xmlHttp.open( "POST", "http://64.225.29.130/menu/edit" );
		xmlHttp.send( formData );
	}
	else
	{
		document.getElementById( 'textarea-menu-edit' ).innerHTML = "Invalid Input. ID is required.";
	}
}

function editMenuItemSubmit()
{
	editMenuItem();

	return false;
}

function deleteMenuItem()
{
	window.document.location="./editmenu.html";
	var params = {};
	params[ "name" ] = sessionStorage.getItem('food-Item');

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

module.exports = {loadIngredients, editMenuItem, editMenuItemSubmit, deleteMenuItem, deleteMenuItemFormSubmit} ;
function getMenu()
{
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) 
		{
			var appetizer = document.querySelector("#menu-appetizer");
			var entree = document.querySelector("#menu-entree");
			var drink = document.querySelector("#menu-drink");
			var desserts = document.querySelector("#menu-desserts");
			var kid = document.querySelector("#menu-kid");

			appetizer.innerHTML="";
			entree.innerHTML="";
			drink.innerHTML="";
			desserts.innerHTML="";
			kid.innerHTML="";
			// Response is a JSON array of items
			var obj = JSON.parse( this.responseText );
			
			var numItems = Object.keys( obj ).length;
      
	//		doc.innerHTML = "Number of Menu Items: " + numItems + "\n";


			obj.forEach(function(d) {
				if(d.category=="appetizer")
				{
					appetizer.innerHTML+="    "+"<button class=\"menu-box\" id=\"food\" onclick=\"displayInfo('"+d.name+"');\"><img style=\"width:120px; height:120px; border-radius:50% \" src=\""+d.image+"\"<button>"+d.name;
				}
				else if(d.category=="entree")
				{
					entree.innerHTML+="    "+"<button class=\"menu-box\" id=\"food\" onclick=\"displayInfo('"+d.name+"');\"><img style=\"width:120px; height:120px; border-radius:50% \" src=\""+d.image+"\"<button>"+d.name;
				}
				else if(d.category=="drink")
				{
					drink.innerHTML+="    "+"<button class=\"menu-box\" id=\"food\" onclick=\"displayInfo('"+d.name+"');\"><img style=\"width:120px; height:120px; border-radius:50% \" src=\""+d.image+"\"<button>"+d.name;
				}
				else if(d.category=="dessert")
				{
					desserts.innerHTML+="    "+"<button class=\"menu-box\" id=\"food\" onclick=\"displayInfo('"+d.name+"');\"><img style=\"width:120px; height:120px; border-radius:50% \" src=\""+d.image+"\"<button>"+d.name;
				}
				else if(d.category=="kid")
				{
					kid.innerHTML+="    "+"<button class=\"menu-box\" id=\"food\" onclick=\"displayInfo('"+d.name+"');\"><img style=\"width:120px; height:120px; border-radius:50% \" src=\""+d.image+"\"<button>"+d.name;
				}
				
			});

		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Request inventory status response: " + this.status );
		}
	};

	// Send a GET request to 64.225.29.130/menu/view
	xmlHttp.open( "GET", "http://64.225.29.130/menu/view", true );
	xmlHttp.send();
	//var x = setTimeout(getMenu, 1000);
}

function displayInfo(name)
{
	sessionStorage.setItem('food-Item',name);
	window.document.location="./viewfood.html";

}

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
			//Loads the ingredients for an item the manager is viewing
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

function createMenuItem()
{
	var formData = new FormData( createMenuItemForm );
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
	createMenuItem();

	return false;
}

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

	// Send a POST request to 64.225.29.130/menu/delete with selected parameters in key-value format
	xmlHttp.open( "POST", "http://64.225.29.130/menu/delete?" + params, true );
	xmlHttp.send( params );
}

function deleteMenuItemFormSubmit()
{
	deleteMenuItem();

	return false;
}

module.exports = {getMenu, displayInfo,loadIngredients, createMenuItem, createMenuItemSubmit, deleteMenuItem, deleteMenuItemFormSubmit} ;
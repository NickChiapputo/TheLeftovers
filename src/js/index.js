function getInventoryList() {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) 
		{
			var doc = document.getElementById( 'textarea-view' );
		
			// Response is a JSON array of items
			var obj = JSON.parse( this.responseText );
			
			var numItems = Object.keys( obj ).length;
			doc.innerHTML = "Number of Inventory Items: " + numItems + "\n";

			var i;
			for( i = 0; i < numItems; i++ )
			{
				var currItem = obj[ i ];
				doc.innerHTML += "Item " + ( i + 1 ) + "\n" + 
						"    Name:  " + currItem.name + "\n" + 
						"    Count: " + currItem.count + "\n\n";
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

function editInventoryItem()
{
	var params = {};
	params[ "name" ] = document.getElementsByName( "name-edit" )[ 0 ].value
	params[ "count" ] = document.getElementsByName( "count-edit" )[ 0 ].value
	console.log( "Output Payload: " + JSON.stringify( params ) )
	// var params = 	"name=" + document.getElementsByName( "name-edit" )[ 0 ].value + 
			// "&count=" + document.getElementsByName( "count-edit" )[ 0 ].value;
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) 
		{
			console.log( this.responseText );
			// Response is a JSON object
			var obj = JSON.parse( this.responseText );
			if( obj == null )
				document.getElementById( 'textarea-edit' ).innerHTML = "Unable to: find item '" + document.getElementsByName( "name-edit" )[ 0 ].value + "'\n";
			else
				document.getElementById( 'textarea-edit' ).innerHTML = "Updated Item: \n" + 
					"    Name:  " + obj.name + "\n" +  
					"    Count: " + obj.count + "\n";
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Edit inventory status response: " + this.status );
		}
	};

	// Send a POST request to 64.225.29.130/inventory/edit with selected parameters in key-value format (?key1=value1&key2=value2 etc.)
	xmlHttp.open( "POST", "http://64.225.29.130/inventory/edit", true );
	xmlHttp.send( JSON.stringify( params ) );
}

function editFormSubmit()
{
	editInventoryItem();
	// Function must return false to prevent reloading of page
	return false;
}


function createInventoryItem()
{
	var params = "name=" + document.getElementsByName( "name-create" )[ 0 ].value + 
				"&count=" + document.getElementsByName( "count-create" )[ 0 ].value;

	var xmlHttp = new XMLHttpRequest();

	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 )
		{
			console.log( this.responseText );

			// Response is a JSON object
			var obj = JSON.parse( this.responseText );

			if( obj == null )
			 	document.getElementById( 'textarea-create' ).innerHTML = "Unable to create item.\n";
			else
			 	document.getElementById( 'textarea-create' ).innerHTML = "Created Item: \n" + 
			 		"    Name:  " + obj.name + "\n" + 
			 		"    Count: " + obj.count + "\n";
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Create inventory item status response: " + this.status );
		}
	};

	// Send a POST request to 64.225.29.130/inventory/create with selected parameters in key-value format
	xmlHttp.open( "POST", "http://64.225.29.130/inventory/create?" + params, true );
	xmlHttp.send( params );
}

function createFormSubmit()
{
	createInventoryItem();
	// Function must return false to prevent reloading of page
	return false;
}


function deleteInventoryItem()
{
	var params = "name=" + document.getElementsByName( "name-delete" )[ 0 ].value;

	var xmlHttp = new XMLHttpRequest();

	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 )
		{
			console.log( this.responseText );

			// Response is a JSON object
			var obj = JSON.parse( this.responseText );

			if( obj == null || obj.ok != 1 || obj.n != 1 )
				document.getElementById( 'textarea-delete' ).innerHTML = "Unable to delete item.\n";
			else
				document.getElementById( 'textarea-delete' ).innerHTML = "Deleted Item\n";
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Create inventory item status response: " + this.status );
		}
	};

	// Send a POST request to 64.225.29.130/inventory/create with selected parameters in key-value format
	xmlHttp.open( "POST", "http://64.225.29.130/inventory/delete?" + params, true );
	xmlHttp.send( params );
}

function deleteFormSubmit()
{
	deleteInventoryItem();
	// Function must return false to prevent reloading of page
	return false;
}


function getMenu()
{
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) 
		{
			var doc = document.getElementById( 'textarea-menu-view' );
		
			// Response is a JSON array of items
			var obj = JSON.parse( this.responseText );
			
			var numItems = Object.keys( obj ).length;
	//		doc.innerHTML = "Number of Menu Items: " + numItems + "\n";

	//		doc.innerHTML = this.responseText;
			doc.innerHTML+="<link rel=\"stylesheet\" href=\"../css/style.css\"> <link rel=\"stylesheet\" href=\"https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css\" integrity=\"sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T\" crossorigin=\"anonymous\"><div class=\"container-fluid center-div\">";
			 var i;
			 for( i = 0; i < numItems; i++ )
			 {				  
				 var currItem = obj[ i ];
				 if(currItem.image[0]!='h'&&currItem.image[1]!='t'&&currItem.image[2]!='t'&&currItem.image[3]!='p')
					 currItem.image= "http://"+currItem.image;

				
				var img = 
				document.createElement("img");
				img.setAttribute("src",currItem.image);
				img.setAttribute("width","200");
				img.setAttribute("height","200");
				img.setAttribute("alt", "food");
				img.setAttribute("id","imgh")

				doc.appendChild(img);
				doc.innerHTML+=currItem.name;

					doc.innerHTML += 	"\n    mItem " + ( i + 1 ) + "\n" + 
										"    mName: " + currItem.name + "\n" + 
										"    mPrice: " + currItem.price + "\n"+
										"    mingredients: ";
										for(j = 0; j < currItem.ingredients.length; j++)
										{
											doc.innerHTML+=currItem.ingredients[j];
											if(j!=currItem.ingredients.length-1)
												doc.innerHTML+=",";
										}
										doc.innerHTML+="\n"
										+"<p id='imgh'>    mcalories: "+currItem.calories+"</p>\n"
										+"    mallergens: "+currItem.allergens+"\n"
										+"    mcategory: "+currItem.category+"</div>\n\n";
									   					
			 }
			 doc.innerHTML+="</div>"
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Request inventory status response: " + this.status );
		}
	};

	// Send a GET request to 64.225.29.130/inventory/view
	xmlHttp.open( "GET", "http://64.225.29.130/menu/view", true );
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

function createMenuItemAddNewIngredient()
{
	var ingredientsLabel = document.getElementById( "menu-item-create-ingredients-label-cell" );
	var ingredients = document.getElementById( "menu-item-create-ingredients-cell" );

	var hasIngredientLabel = document.getElementById( "menu-item-create-has-ingredient-label-cell" );
	var hasIngredient = document.getElementById( "menu-item-create-has-ingredient-cell" );

	var ingredientCountLabel = document.getElementById( "menu-item-create-ingredient-count-label-cell" );
	var ingredientCount = document.getElementById( "menu-item-create-ingredient-count-cell" );

	var numIngredients = Number( document.getElementById( "menu-item-add-ingredient-cell" ).getAttribute( "data-numIngredients" ) );
	document.getElementById( "menu-item-add-ingredient-cell" ).setAttribute( "data-numIngredients", numIngredients + 1 );


	ingredientsLabel.innerHTML += '<div style="margin-left: 5vw;">Ingredient ' + ( numIngredients + 1 ) + '</div>';
	ingredients.innerHTML += '<input style="width: 25vw;" type="text" required name="menu-item-create-ingredient-' + ( numIngredients + 1 ) + '" />';
	
	hasIngredientLabel.innerHTML += '<div style="margin-left: 5vw;">Has Ingredient ' + ( numIngredients + 1 ) + '</div>';
	hasIngredient.innerHTML += '<input style="width: 25vw;" type="number" required name="menu-item-create-has-ingredient-' + ( numIngredients + 1 ) + '" />';
	
	ingredientCountLabel.innerHTML += '<div style="margin-left: 5vw;">Ingredient ' + ( numIngredients + 1 ) + ' Count</div>';
	ingredientCount.innerHTML += '<input style="width: 25vw;" type="number" required name="menu-item-create-ingredient-count-' + ( numIngredients + 1 ) + '" />';
}

function createMenuItemAddNewAllergen()
{
	var allergensLabel = document.getElementById( "menu-item-create-allergens-label-cell" );
	var allergens = document.getElementById( "menu-item-create-allergens-cell" );

	var numAllergens = Number( document.getElementById( "menu-item-add-allergens-cell" ).getAttribute( "data-numAllergens" ) );
	document.getElementById( "menu-item-add-allergens-cell" ).setAttribute( "data-numAllergens", numAllergens + 1 );


	allergensLabel.innerHTML += '<div style="margin-left: 5vw;">Allergen ' + ( numAllergens + 1 ) + '</div>';
	allergens.innerHTML += '<input style="width: 25vw;" type="text" required name="menu-item-create-allergens-' + ( numAllergens + 1 ) + '" />';
}

function createMenuItemSubmit()
{
	createMenuItem();

	return false;
}


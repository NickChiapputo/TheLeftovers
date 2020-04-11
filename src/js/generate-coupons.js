function createCoupon()
{
	var params = {};
	params["name"] = document.getElementsByName( "name" )[ 0 ].value;
	params["discount"] = document.getElementsByName( "discount" )[ 0 ].value;
	params["expiration"] = document.getElementsByName("expiration")[0].value;
	params["rewards"] = document.getElementsByName("rewards")[0].value;

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
			 		"     Name:  " + obj.name + "\n"+ 
					 "    Discount: " + obj.discount + "\n"+
					 "    Expiration: "+obj.expiration+ "\n"+
					 "    RewardsAcct: "+obj.rewards+"\n";					 
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Create inventory item status response: " + this.status );
		}
	};

	// Send a POST request to 64.225.29.130/inventory/create with selected parameters in key-value format
	xmlHttp.open( "POST", "http://64.225.29.130/test" + params, true );
	xmlHttp.send( JSON.stringify(params) );
}

function createFormSubmit()
{
	createCoupon();
	return false;
}

function deleteCoupon()
{
	var params = {};
	params["name"] = document.getElementsByName( "name" )[ 0 ].value;
	params["discount"] = document.getElementsByName( "discount" )[ 0 ].value;
	params["expiration"] = document.getElementsByName("expiration")[0].value;
	params["rewards"] = document.getElementsByName("rewards")[0].value;

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
			 		"     Name:  " + obj.name + "\n"+ 
					 "    Discount: " + obj.discount + "\n"+
					 "    Expiration: "+obj.expiration+ "\n"+
					 "    RewardsAcct: "+obj.rewards+"\n";					 
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Create inventory item status response: " + this.status );
		}
	};

	// Send a POST request to 64.225.29.130/inventory/create with selected parameters in key-value format
	xmlHttp.open( "POST", "http://64.225.29.130/test" + params, true );
	xmlHttp.send( JSON.stringify(params) );
}

function deleteFormSubmit()
{
	deleteCoupon();
	return false;
}
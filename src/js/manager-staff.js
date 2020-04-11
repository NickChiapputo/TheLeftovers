function createEmployee()
{
	var params = {};
    params["firstName"] = document.getElementsByName( "first" )[ 0 ].value;
    params["middleName"] = document.getElementsByName("middle")[0].value;
	params["lastName"] = document.getElementsByName( "last" )[ 0 ].value;
    params["type"] = document.getElementsByName("type")[0].value;
    params["pin"];
    params["tips"];
    params["comps"];

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
                     "     First:  " + obj.first+
                     "     Middle: " + obj.middle+
					 "     Last: " + obj.last+
                     "     Type: "+obj.type;
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Create inventory item status response: " + this.status );
		}
	};

	// Send a POST request to 64.225.29.130/inventory/create with selected parameters in key-value format
	xmlHttp.open( "POST", "http://64.225.29.130/employees/create" + params, true );
	xmlHttp.send( JSON.stringify(params) );
}

function createEmployeeFormSubmit()
{
	createEmployee();
	return false;
}
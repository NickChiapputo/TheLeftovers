function logout()
{
    //Uses the id and pin stored from the users session storage is added to the parameters to logout
    var params={}
    params['_id']=sessionStorage.getItem('employee-id');
    params['pin']=sessionStorage.getItem('employee-pin');
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 )
		{
			console.log( this.responseText );

			// Response is a JSON object
			var obj = JSON.parse( this.responseText );

            if( obj == null || obj.ok != 1 || obj.n != 1 )//On Success brings manager back to the login page
            {
                document.location="login.html";
            }
            else
            {
               document.getElementById( 'textarea-login' ).innerHTML = "Invalid ID or PIN\n";
            }
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Create inventory item status response: " + this.status );
		}
	};

	// Send a POST request to 64.225.29.130/inventory/create with selected parameters in key-value format
	xmlHttp.open( "POST", "http://64.225.29.130/employees/logout",true );
	xmlHttp.send( JSON.stringify(params ));
}

module.exports = {logout} ;
function login()
{
	//Collects user inputed data in username and password
    var params={}
    params['_id']=document.getElementsByName('uname')[0].value;
    params['pin']=document.getElementsByName('psw')[0].value;
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 )
		{
			console.log( this.responseText );

			// Response is a JSON object
			var obj = JSON.parse( this.responseText );
            if( obj == null || obj.ok != 1 || obj.n != 1 && obj.response!=undefined)
            {
				sessionStorage.setItem('employee-id',params['_id']);//Saves username and password for messages and logout later
				sessionStorage.setItem('employee-pin',params['pin']);
				sessionStorage.setItem('employee-type',obj.type);
				//Sends employee to their appropriate screen based on type
				if(obj.type=="manager")
				{
					window.document.location="../managers/manager1.html";
				}
				if(obj.type=="server")
				{
					window.document.location="../servers/server_options.html";
				}
                document.getElementById( 'textarea-login' ).innerHTML = this.responseText;
              
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

	// Send a POST request to 64.225.29.130/employees/login with selected parameters in key-value format
	xmlHttp.open( "POST", "http://64.225.29.130/employees/login",true );
	xmlHttp.send( JSON.stringify(params ));
}

module.exports = {login} ;
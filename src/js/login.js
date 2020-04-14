function login()
{
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

            if( obj == null || obj.ok != 1 || obj.n != 1 )
            {
				sessionStorage.setItem('employee-id',params['_id'])
                document.getElementById( 'textarea-login' ).innerHTML = this.responseText;
                checkType(params['_id']);
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
	xmlHttp.open( "POST", "http://64.225.29.130/employees/login",true );
	xmlHttp.send( JSON.stringify(params ));
}
//5e924b86ecc95c521190e478
//9255
function checkType(id)
{
    alert(id);
    var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) 
		{
			//var doc = document.getElementById( 'textarea-view' );
			// Response is a JSON array of items
			var obj = JSON.parse( this.responseText );
			var txt="";
			var numItems = Object.keys( obj ).length;
//			<!--doc.innerHTML = "<p>Number of Inventory Items: " + numItems + "</p>";-->

			for( i = 0; i < numItems; i++ )
			{
				var currItem = obj[i];
				if(currItem._id==id)
				{
					sessionStorage.setItem('employee-type',currItem.type);
                	if(currItem.type=="manager")
                	{
                	    window.document.location="../managers/manager1.html";
                	}
                	if(currItem.type=="server")
                	{
                	    window.document.location="../servers/server_options.html";
                	}
				}
            }
            
        }
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Request inventory status response: " + this.status );
		}
	};

	// Send a GET request to 64.225.29.130/inventory/view
	xmlHttp.open( "GET", "http://64.225.29.130/employees/view");
	xmlHttp.send();
}
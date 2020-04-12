function createEmployee()
{
	var params = {};
    params["first"] = document.getElementsByName( "first" )[ 0 ].value;
    params["middle"] = document.getElementsByName("middle")[0].value;
	params["last"] = document.getElementsByName( "last" )[ 0 ].value;
    params["type"] = document.getElementsByName("type")[0].value;


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
	xmlHttp.open( "POST", "http://64.225.29.130/employees/create" );
	xmlHttp.send( JSON.stringify(params) );
}

function createEmployeeFormSubmit()
{
	createEmployee();
	return false;
}

function deleteEmployee()
{
	var params = {};
    params["_id"] = document.getElementsByName( "eid" )[ 0 ].value;



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
                     "     Eid:  " + obj._id;
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Create inventory item status response: " + this.status );
		}
	};

	// Send a POST request to 64.225.29.130/inventory/create with selected parameters in key-value format
	xmlHttp.open( "POST", "http://64.225.29.130/employees/delete");
	xmlHttp.send( JSON.stringify(params) );
}

function deleteEmployeeFormSubmit()
{
	deleteEmployee();
	return false;
}


function getEmployeeList() {
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
			var i;
			txt += "<table style='width:100%; border: 1px solid black;'>" + "<tr><th style=' background-color: black; color: white;'>EID</th><th style=' background-color: black; color: white;'>First</th><th style=' background-color: black; color: white;'>Middle</th><th style=' background-color: black; color: white;'>Last</th><th style=' background-color: black; color: white;'>Pin</th><th style=' background-color: black; color: white;'>Type</th><th style=' background-color: black; color: white;'>Shifts</th><th style=' background-color: black; color: white;'>Tips</th><th style=' background-color: black; color: white;'>Comps</th>"
			for( i = 0; i < numItems; i++ )
			{
                var currItem = obj[ i ];
                if(currItem.middle===undefined)
                {
                    currItem.middle="N/A";
                }
                if(currItem.tips=="")
                {
                    currItem.tips=0;
                }
                if(currItem.shifts=="")
                {
                    currItem.shifts=0;
                }
                if(currItem.comps=="")
                {
                    currItem.comps=0;
                }

				txt += "<tr><td style=' background-color: white; color: black;'>" + currItem._id + "</td><td style=' background-color: white; color: black;'>" 
						+currItem.first + "</td><td style=' background-color: white; color: black;'>"  
                        +currItem.middle + "</td><td style=' background-color: white; color: black;'>"
                        +currItem.last +"</td></td><td style=' background-color: white; color: black;'>"
                        +currItem.pin +"</td><td style=' background-color: white; color: black;'>"
                        +currItem.type+"</td><td style=' background-color: white; color: black;'>"
                        +currItem.shifts+"</td><td style=' background-color: white; color: black;'>"
                        +currItem.tips+"</td><td style=' background-color: white; color: black;'>"
                        +currItem.comps+"</td><td style=' background-color: white; color: black;'></tr>";
			}
			txt += "</table>"
			document.getElementById('emptxt').innerHTML = txt;
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Request inventory status response: " + this.status );
		}
	};

	// Send a GET request to 64.225.29.130/inventory/view
	xmlHttp.open( "GET", "http://64.225.29.130/employees/view", true );
	xmlHttp.send();
}

function getEmployeeFormSubmit()
{
	getEmployeeList();
	return false;
}
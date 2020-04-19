function createEmployee()
{
	//Populates paramaters with user input data
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
			else//On Success
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

	// Send a POST request to 64.225.29.130/employees/create with selected parameters in key-value format
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
	//Grabs the specified id from the user
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
			 	document.getElementById( 'textarea-create' ).innerHTML = "Unable to delete item.\n";
			else//On success
			 	document.getElementById( 'textarea-create' ).innerHTML = "Deleted Item: \n" + 
                     "     Eid:  " + obj._id;
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Create inventory item status response: " + this.status );
		}
	};

	// Send a POST request to 64.225.29.130/employees/delete with selected parameters in key-value format
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
			//Displays the list of employees in tables format
			var obj = JSON.parse( this.responseText );
			var txt="";
			var numItems = Object.keys( obj ).length;
			var i;
			txt += "<table style='width:100%; border: 1px solid black;'>" + "<tr><th style=' background-color: black; color: white;'>EID</th><th style=' background-color: black; color: white;'>First</th><th style=' background-color: black; color: white;'>Middle</th><th style=' background-color: black; color: white;'>Last</th><th style=' background-color: black; color: white;'>Pin</th><th style=' background-color: black; color: white;'>Type</th><th style=' background-color: black; color: white;'>Tips</th><th style=' background-color: black; color: white;'>Comps</th><th style=' background-color: black; color: white;'>Hours</th>"
			for( i = 0; i < numItems; i++ )
			{
				var currItem = obj[ i ];
				var shifts = [];
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
                    shifts.push(0);
				}
				else
				{
					currItem.shifts.forEach(function (shift) {
						shifts.push(" "+shift.date+" "+shift.start+" to "+shift.end);
					});

				}
                if(currItem.comps=="")
                {
                    currItem.comps=0;
				}
				if(currItem.hours==undefined)
				{
					currItem.hours=0;
				}

				txt += "<tr><td style=' background-color: white; color: black;'>" + currItem._id + "</td><td style=' background-color: white; color: black;'>" 
						+currItem.first + "</td><td style=' background-color: white; color: black;'>"  
                        +currItem.middle + "</td><td style=' background-color: white; color: black;'>"
                        +currItem.last +"</td></td><td style=' background-color: white; color: black;'>"
                        +currItem.pin +"</td><td style=' background-color: white; color: black;'>"
                        +currItem.type+"</td><td style=' background-color: white; color: black;'>"
						+"$"+(currItem.tips).toFixed(2)+"</td><td style=' background-color: white; color: black;'>"
						+currItem.comps+"</td><td style=' background-color: white; color: black;'>"
                        +(currItem.hours).toFixed(2)+"</td></tr>";
			}
			txt += "</table>"
			document.getElementById('emptxt').innerHTML = txt;
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Request inventory status response: " + this.status );
		}
	};

	// Send a GET request to 64.225.29.130/employees/view
	xmlHttp.open( "GET", "http://64.225.29.130/employees/view", true );
	xmlHttp.send();
}

function getEmployeeFormSubmit()
{
	getEmployeeList();
	return false;
}

function editEmployee()
{
	//Edits an employee given from parameters that the user specified
	var params = {};
	params['_id'] = document.getElementsByName('EID')[0].value;
    params["first"] = document.getElementsByName( "efirst" )[ 0 ].value;
    params["middle"] = document.getElementsByName("emiddle")[0].value;
	params["last"] = document.getElementsByName( "elast" )[ 0 ].value;
    params["type"] = document.getElementsByName("etype")[0].value;


	var xmlHttp = new XMLHttpRequest();

	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 )
		{
			console.log( this.responseText );

			// Response is a JSON object
			var obj = JSON.parse( this.responseText );

			if( obj == null )
			 	document.getElementById( 'textarea-edit' ).innerHTML = "Unable to edit item.\n";
			else//On Success
			 	document.getElementById( 'textarea-edit' ).innerHTML = "Edited Item: \n" + 
                     "     First:  " + obj.first+
                     "     Middle: " + obj.middle+
					 "     Last: " + obj.last+
                     "     Type: "+obj.type;
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Edit staff status response: " + this.status );
		}
	};

	// Send a POST request to 64.225.29.130/inventory/create with selected parameters in key-value format
	xmlHttp.open( "POST", "http://64.225.29.130/employees/edit");
	xmlHttp.send( JSON.stringify(params) );
}

function editEmployeeFormSubmit()
{
	editEmployee();
	return false;
}

module.exports = {createEmployee, createEmployeeFormSubmit, deleteEmployee, deleteEmployeeFormSubmit, getEmployeeList, getEmployeeFormSubmit, editEmployee, editEmployeeFormSubmit} ;
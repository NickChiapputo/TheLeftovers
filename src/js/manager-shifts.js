function employeeChangeShift( create )
{
	// Check if form is valid
	if( document.getElementById( "createShiftForm" ).checkValidity() )
	{
		var shift = {};

		// Get employee ID
		shift[ "_id" ] = document.getElementsByName( "employee-create-shift-id" )[ 0 ].value;

		// Get shift date
		shift[ "date" ] = document.getElementsByName( "employee-create-shift-date" )[ 0 ].value;
		
		// Get start time
		shift[ "start" ] = document.getElementsByName( "employee-create-shift-start-time" )[ 0 ].value
		
		// Get end time
		shift[ "end" ] = document.getElementsByName( "employee-create-shift-end-time" )[ 0 ].value

		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function() {
			if( this.readyState == 4 && this.status == 200 ) 
			{
				document.getElementById( "textarea-employees-" + ( create ? "create" : "remove" ) + "-shift" ).innerHTML = "Successful";
			}
			else if( this.readyState == 4 && this.status != 200 )
			{
				document.getElementById( "textarea-employees-" + ( create ? "create" : "remove" ) + "-shift" ).innerHTML = "Failed" + "\n";
			}
		};

		console.log( "Sending: " + JSON.stringify( shift ) );

		// Send a POST request to 64.225.29.130/employees/shift/create or remove based on source call
		xmlHttp.open( "POST", "http://64.225.29.130/employees/shift/" + ( create ? "create" : "remove" ), true );
		xmlHttp.send( JSON.stringify( shift ) );
	}
	else
	{
		document.getElementById( "textarea-employees-" + ( create ? "create" : "remove" ) + "-shift" ).innerHTML = "Invalid input.";
	}
}

function employeeCreateShiftSubmit( create )
{
	employeeChangeShift( create );

	return false;
}
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

function displayShifts()
{
	let date = new Date();
	var month = date.getMonth()+1;
	var daten = date.getDate
	if(parseInt(date.getDate())<10)
	{
		date.getDate()="0"+date.getDate();
	}
	if(parseInt(month<10))
	{
		month=date.getMonth()+1;
		month="0"+month;
	}
//	if(parseInt((date.getDate()-date.getDay()))<10)
//	{
//		date.getDate="0"+date.getDate();
//	}
	let day0= (date.getFullYear()+'-'+month+'-'+(date.getDate()-date.getDay()));
		day0 = new LocalDate(day0);
	let day1 = date.getFullYear()+'-'+month+'-'+(date.getDate()-date.getDay());
	let day2 = date.getFullYear()+'-'+month+'-'+(date.getDate()-date.getDay());
	let day3 = date.getFullYear()+'-'+month+'-'+(date.getDate()-date.getDay());
	let day4 = date.getFullYear()+'-'+month+'-'+(date.getDate()-date.getDay());
	let day5 = date.getFullYear()+'-'+month+'-'+(date.getDate()-date.getDay());
	let day6 = date.getFullYear()+'-'+month+'-'+(date.getDate()-date.getDay());
	alert(day0);
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
			for( i = 0; i < numItems; i++ )
			{
				var currItem = obj[ i ];
				var shifts = [];

				currItem.shifts.forEach(function (shift) {
						if(shift.date==day0)
						{
							document.getElementById("sunday").innerHTML+="<p style=\"font-size:12px\" text-align:left>"+currItem.first+" "+currItem.last+":"+
							shift.start+"-"+shift.end+"</p>";
						}
						else if(shift.date==day1)
						{
							document.getElementById("monday").innerHTML+="<p style=\"font-size:12px\" text-align:left>"+currItem.first+" "+currItem.last+":"+
							shift.start+"-"+shift.end+"</p>";
						}
						else if(shift.date==day3)
						{
							document.getElementById("tuesday").innerHTML+="<p style=\"font-size:12px\" text-align:left>"+currItem.first+" "+currItem.last+":"+
							shift.start+"-"+shift.end+"</p>";
						}
						else if(shift.date==day4)
						{
							document.getElementById("wednesday").innerHTML+="<p style=\"font-size:12px\" text-align:left>"+currItem.first+" "+currItem.last+":"+
							shift.start+"-"+shift.end+"</p>";
						}
						else if(shift.date==day5)
						{
							document.getElementById("thursday").innerHTML+="<p style=\"font-size:12px\" text-align:left>"+currItem.first+" "+currItem.last+":"+
							shift.start+"-"+shift.end+"</p>";
						}
						else if(shift.date==day6)
						{
							document.getElementById("friday").innerHTML+="<p style=\"font-size:12px\" text-align:left>"+currItem.first+" "+currItem.last+":"+
							shift.start+"-"+shift.end+"</p>";
						}
				});
			}
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
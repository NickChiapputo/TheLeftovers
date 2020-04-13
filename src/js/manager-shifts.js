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

function employeeDeleteShift( create )
{
	// Check if form is valid
	if( document.getElementById( "removeShiftForm" ).checkValidity() )
	{
		var shift = {};

		// Get employee ID
		shift[ "_id" ] = document.getElementsByName( "employee-delete-shift-id" )[ 0 ].value;

		// Get shift date
		shift[ "date" ] = document.getElementsByName( "employee-delete-shift-date" )[ 0 ].value;
		
		// Get start time
		shift[ "start" ] = document.getElementsByName( "employee-delete-shift-start-time" )[ 0 ].value
		
		// Get end time
		shift[ "end" ] = document.getElementsByName( "employee-delete-shift-end-time" )[ 0 ].value

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

function employeeDeleteShiftSubmit( create )
{
	employeeDeleteShift( create );

	return false;
}

function displayShifts()
{
	let date = new Date();
	let year = date.getFullYear();
	let month = date.getMonth()+1
	dt = date.getDate();

	if(dt < 10)
	{
		dt = '0' + dt;
	}
	if(month < 10)
	{
		month = '0' + month;
	}

	let day0= (year+'-'+month+'-'+(dt-date.getDay()));
	let day1 = (year+'-'+month+'-'+(dt+1-date.getDay()));
	let day2 = (year+'-'+month+'-'+(dt+2-date.getDay()));
	let day3 = (year+'-'+month+'-'+(dt+3-date.getDay()));
	let day4 = (year+'-'+month+'-'+(dt+4-date.getDay()));
	let day5 = (year+'-'+month+'-'+(dt+5-date.getDay()));
	let day6 = (year+'-'+month+'-'+(dt+6-date.getDay()));
	document.getElementById("sunday").innerHTML="";
	document.getElementById("monday").innerHTML="";
	document.getElementById("tuesday").innerHTML="";
	document.getElementById("wednesday").innerHTML="";
	document.getElementById("thursday").innerHTML="";
	document.getElementById("friday").innerHTML="";
	document.getElementById("saturday").innerHTML="";
	document.getElementById("sunday").innerHTML="";

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
			txt += "<table style='width:100%; border: 1px solid black;'>" + "<tr><th style=' background-color: black; color: white;'>EID</th><th style=' background-color: black; color: white;'>First</th><th style=' background-color: black; color: white;'>Middle</th><th style=' background-color: black; color: white;'>Last</th>";
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

				txt += "<tr><td style=' background-color: white; color: black;'>" + currItem._id + "</td><td style=' background-color: white; color: black;'>" 
						+currItem.first + "</td><td style=' background-color: white; color: black;'>"  
                        +currItem.middle + "</td><td style=' background-color: white; color: black;'>"
                        +currItem.last +"</td><td style=' background-color: white; color: black;'>";
			}
			txt += "</table>"
			document.getElementById('emptxt').innerHTML = txt;
			document.getElementById('emptxt1').innerHTML = txt;
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
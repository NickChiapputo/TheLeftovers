 function managerSearch()
{
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) 
		{
			// Response is a JSON array of items
			var obj = JSON.parse( this.responseText );

			var numItems = Object.keys( obj ).length;
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
		 
			let today = (year+'-'+month+'-'+(dt));
			obj.forEach(function(employee)
			{
				if(employee.type=='manager')
				{
					if(employee.loggedIn=='1')
					{
						help(employee._id)
					}
				}
			});
			
			console.log( this.responseText );
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			return then(this.responseText)
		}
	};

	// Send a GET request to 64.225.29.130/inventory/view
    xmlHttp.open( "GET", "http://64.225.29.130/employees/view", true );
	xmlHttp.send();
}

function help(managerid)
{
	var params = {}
		params['src']=sessionStorage.getItem('employee-id');
		params['srcType']='server';
		params['dest']=managerid;
		params['destType']='manager';
		params['request']='help';

		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function() {
			if( this.readyState == 4 && this.status == 200 ) 
			{
				// Response is a JSON array of items
				var obj = JSON.parse( this.responseText );
				var numItems = Object.keys( obj ).length;
	
				alert("Manager "+managerid+" was notified");
				console.log( this.responseText );
			}
			else if( this.readyState == 4 && this.status != 200 )
			{
			}
		};
	
		// Send a GET request to 64.225.29.130/inventory/view
		xmlHttp.open( "POST", "http://64.225.29.130/messages/send", true );
		xmlHttp.send(JSON.stringify(params));
}

module.exports = {managerSearch, help} ;

function getMessages()
{
    var params = {};
    params['dest'] = sessionStorage.getItem('employee-id');
    params['destType'] = sessionStorage.getItem('employee-type');
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function() {
			if( this.readyState == 4 && this.status == 200 )
			{
				console.log( this.responseText );

				// Response is a JSON array of items
				var obj = JSON.parse( this.responseText );
				var numItems = Object.keys( obj ).length;
				if(numItems>0)
				{
					var txt = "";
					alert('new messages');
					obj.forEach(function (message) {
						console.log( "'" + message.request + "'" );
						if( message.request === 'help' )
						{
							if( message.srcType === 'table' )
							{
								txt += "Table " + message.src + " requests help.\n";
							}
							else if( message.srcType === 'server' )
							{
								txt += " Server " + message.src + " requests help.\n";
							}
							else
							{
								txt += "Kitchen requests help for an order.\n";
							}
						}
						else if( message.request === 'refill' )
						{
							txt += "Table " + message.src + " requests a refill.\n";
						}
						else
						{
							// Order completion from table
							txt += message.request + "\n";
							console.log( "txt" );
						}
						// txt+=message.src+" "+message.request+" ";
					});
					sessionStorage.setItem('newmessage',txt)
					updateNotifications();
				}
				console.log( this.responseText );
				return true;
			}
			else if( this.readyState == 4 && this.status != 200 )
			{
				console.log( "Get Messages status response: " + this.status );
			}
		};

		// Send a GET request to 64.225.29.130/inventory/view
		xmlHttp.open( "POST", "http://64.225.29.130/messages/get", true );
		xmlHttp.send(JSON.stringify(params));
		return params['dest']+params['destType'];
}

function updateNotifications()
{
	console.log( "" )
	alert(sessionStorage.getItem('newmessage'))
	document.getElementById("notifications").innerHTML+=sessionStorage.getItem('newmessage');
}

module.exports = {getMessages,updateNotifications} ;
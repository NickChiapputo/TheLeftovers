function getMessages()
{
    var params = {};
    params['dest'] = sessionStorage.getItem('employee-id');
    params['destType'] = sessionStorage.getItem('employee-type');    
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function() {
			if( this.readyState == 4 && this.status == 200 ) 
			{
	//			var doc = document.getElementById( 'order-view-area' );
	
				console.log( this.responseText );
			
				// Response is a JSON array of items
				var obj = JSON.parse( this.responseText );
				var numItems = Object.keys( obj ).length;
				if(numItems>0)
				{
					var txt = "";
					alert('new messages');
					obj.forEach(function (message) {
						txt+="<p>"+message.src+" "+message.request+"</p>";
					});
					sessionStorage.setItem('newmessage',txt)
					updateNotifications();
				}
                console.log( this.responseText );
			}
			else if( this.readyState == 4 && this.status != 200 )
			{
	//			document.getElementById( 'textarea-orders-view' ).innerHTML = "Rewards accounts inventory status response: " + this.status;
				console.log( "Get Messages status response: " + this.status );
			}
		};
	
		// Send a GET request to 64.225.29.130/inventory/view
		xmlHttp.open( "POST", "http://64.225.29.130/messages/get", true );
		xmlHttp.send(JSON.stringify(params));
}

function updateNotifications()
{
	alert(sessionStorage.getItem('newmessage'))
	document.getElementById("notifications").innerHTML+=sessionStorage.getItem('newmessage');
}
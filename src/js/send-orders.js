function send_order()
{
	var jsonOrder = (Cookies.getJSON('current_order'));
	jsonOrder.status = 'ordered';

	var i;
	for (i = jsonOrder.items.length - 1; i >= 0; i--) {
		if (jsonOrder.items[i].sent == 'true') {
			console.log('0');
			jsonOrder.items.splice(i, 1);
		}
	}

	var xmlHttp = new XMLHttpRequest();

	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 )
		{
			console.log( this.responseText );

			// Response is a JSON object
			var obj = JSON.parse( this.responseText );

			console.log(obj);
			if( obj == null )
			 	console.log("Unable to send item.\n");
			else
                console.log("Sent Item: \n" +
			 		JSON.stringify(obj));
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Create inventory item status response: " + this.status );
		}
	};

	console.log(jsonOrder);
	// Send a POST request to 64.225.29.130/inventory/create with selected parameters in key-value format
	xmlHttp.open( "POST", "http://64.225.29.130/orders/create", true );
	xmlHttp.send( JSON.stringify(jsonOrder) );

	jsonOrder = (Cookies.getJSON('current_order'))
	var i;
	for (i=0; i < jsonOrder.items.length; i++) {
		jsonOrder.items[i].sent = 'true';
	}
	jsonOrder.status = 'ordered';
	Cookies.set('current_order', jsonOrder, {path: '/', sameSite: 'strict'});
	loadOrderItems();
}

function sendOrderBtn() {
	var ord = Cookies.getJSON('current_order');
	console.log(ord.items.length);
	if (ord.items == undefined || ord.items.length == 0) {
		document.getElementById('send-order-window').innerText = "Nothing to send";
		document.getElementById('send-body').style.display = 'none';
		document.getElementById('send-yes').style.display = 'none';
		document.getElementById('send-no').style.display = 'none';
		document.getElementById('send-dismiss').style.display = 'unset';
	}
	else if (ord.status != 'in progress') {
		window.location.href="Pay.html";
	}
	else {
		document.getElementById('send-order-window').innerText = "Send order to kitchen?";
		document.getElementById('send-body').style.display = 'unset';
		document.getElementById('send-yes').style.display = 'unset';
		document.getElementById('send-no').style.display = 'unset';
		document.getElementById('send-dismiss').style.display = 'none';
	}
}

function serverSendOrderBtn() {
	var ord = Cookies.getJSON('current_order');
	console.log(ord.items.length);
	if (ord.items == undefined || ord.items.length == 0) {
		document.getElementById('send-order-window').innerText = "Nothing to send";
		document.getElementById('send-body').style.display = 'none';
		document.getElementById('send-yes').style.display = 'none';
		document.getElementById('send-no').style.display = 'none';
		document.getElementById('send-dismiss').style.display = 'unset';
	}
	else if (ord.status != 'in progress') {
		window.location.href="../server_bill_view.html";
	}
	else {
		document.getElementById('send-order-window').innerText = "Send order to kitchen?";
		document.getElementById('send-body').style.display = 'unset';
		document.getElementById('send-yes').style.display = 'unset';
		document.getElementById('send-no').style.display = 'unset';
		document.getElementById('send-dismiss').style.display = 'none';
	}
}

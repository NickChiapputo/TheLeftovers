function send_order()
{
	var jsonOrder = JSON.parse(sessionStorage.getItem('current_order'));
	jsonOrder.status = 'ordered';
	var rewards = sessionStorage.getItem('rewards-number-save');
	if (rewards != null) {
		jsonOrder['rewards'] = rewards;
	}

	for (i = jsonOrder.items.length - 1; i >= 0; i--) {
		jsonOrder.items[i].sent = 'true';
		if (jsonOrder.items[i].free_drink == 'true') {
			jsonOrder.items[i].price = 0;
		}
	}
	sessionStorage.setItem('current_order', JSON.stringify(jsonOrder));

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 )
		{
			console.log( this.responseText );

			// Response is a JSON object
			var obj = JSON.parse( this.responseText );

			document.getElementById('close-pay-response').className = "btn btn-outline-success";
			document.getElementById('order-sent').style.color = 'green';
			document.getElementById('order-sent-title').innerText = "Sent!";
			document.getElementById('order-sent-text').innerText = "Your order will be out soon!";			
			console.log( "Create inventory item status response: " + this.status );

			console.log(obj);
			if( obj == null )
			 	console.log("Unable to send item.\n");
			else {
				console.log("Sent Item: \n" + JSON.stringify(obj));
				loadOrderItems();
			}
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			document.getElementById('close-pay-response').className = "btn btn-outline-danger";
			document.getElementById('order-sent').style.color = 'red';
			document.getElementById('order-sent-title').innerText = "Not sent";
			document.getElementById('order-sent-text').innerText = "One or more of the selected items is unavailable";			
			console.log( "Create inventory item status response: " + this.status );
			Cookies.remove('current_order');
		}
	};

	console.log(jsonOrder);
	// Send a POST request to 64.225.29.130/inventory/create with selected parameters in key-value format
	xmlHttp.open( "POST", "http://64.225.29.130/orders/create", true );
	xmlHttp.send( JSON.stringify(jsonOrder) );
	return jsonOrder;
}

function sendOrderBtn() {
	var ord = JSON.parse(sessionStorage.getItem('current_order'));
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

module.exports = {send_order,sendOrderBtn,serverSendOrderBtn}
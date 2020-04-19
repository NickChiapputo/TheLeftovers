// sending order to the database
function send_order()
{
	//grabbing order from session storage
	var jsonOrder = JSON.parse(sessionStorage.getItem('current_order'));
	jsonOrder.status = 'ordered';

	// grabbing and rewarding rewards number
	var rewards = sessionStorage.getItem('rewards-number-save');
	if (rewards != null) {
		jsonOrder['rewards'] = rewards;
	}

	// creating new order object to send
	var sendOrd = JSON.stringify(jsonOrder);
	sendOrd = JSON.parse(sendOrd);

	// removing previously sent items
	for (i = jsonOrder.items.length - 1; i >= 0; i--) {
		console.log[i];
		jsonOrder.items[i].sent = 'true';
		if (sendOrd.items[i].sent == 'true') {
			sendOrd.items.splice(i, 1);
		}
		if (sendOrd.items[i].free_drink == 'true') {
			sendOrd.items[i].price = 0;
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

			// printing success info to post-send-order window
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
			// printing failure info to post-send-order window
			document.getElementById('close-pay-response').className = "btn btn-outline-danger";
			document.getElementById('order-sent').style.color = 'red';
			document.getElementById('order-sent-title').innerText = "Not sent";
			document.getElementById('order-sent-text').innerText = "One or more of the selected items is unavailable";			
			console.log( "Create inventory item status response: " + this.status );
			sessionStorage.removeItem('current_order');
		}
	};

	console.log(jsonOrder);
	// Send a POST request to 64.225.29.130/inventory/create with selected parameters in key-value format
	xmlHttp.open( "POST", "http://64.225.29.130/orders/create", true );
	xmlHttp.send( JSON.stringify(sendOrd) );
	return jsonOrder;
}

// displaying data to send confirmation window
function sendOrderBtn() {
	var ord = JSON.parse(sessionStorage.getItem('current_order'));
	console.log(ord.items.length);
	var currDate = new Date();
	var hour = currDate.getHours();
	var minute = currDate.getMinutes();

	// doesn't send while kitchen isn't taking order
	if ((hour >= 23 && minute >= 30) || (hour < 8)) {
		document.getElementById('send-order-window').innerText = "Kitchen only accepts orders between 8:00am and 11:30pm";
		document.getElementById('send-body').style.display = 'none';
		document.getElementById('send-yes').style.display = 'none';
		document.getElementById('send-no').style.display = 'none';
		document.getElementById('send-dismiss').style.display = 'unset';
		return;
	}

	// doesn't send if no items to order
	//else if (ord.items == undefined || ord.items.length == 0) {
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

	// allows send if there are items and the time is right
	else {
		document.getElementById('send-order-window').innerText = "Send order to kitchen?";
		document.getElementById('send-body').style.display = 'unset';
		document.getElementById('send-yes').style.display = 'unset';
		document.getElementById('send-no').style.display = 'unset';
		document.getElementById('send-dismiss').style.display = 'none';
	}
}

function serverSendOrderBtn() {
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
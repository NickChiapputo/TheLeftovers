function loadBill(){

    //set table Number
    var table = sessionStorage.getItem( 'tableid')
    if (table == undefined) {
        table = 0;
    }
    document.getElementById('tableNum').innerText = table;


    //first, get list of orders
    var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) {
			//var doc = document.getElementById( 'textarea-view' );
			var txt ="";
			// Response is a JSON array of items
			var obj = JSON.parse( this.responseText );
            //get total number of tables
			var numBills = Object.keys(obj).length;
            //loop through bills

            var order = 0;
            var totalPrice = 0;
            for (var i = 0; i < numBills; i++){
                if (table == obj[i].table && obj[i].status != 'paid') {
                    totalPrice += obj[i].total;
                    showBill(obj[i], ++order);
                }
            }

            //write grand total
            document.getElementById('itemList').innerText += "Grand Total: $" + totalPrice;

        }

		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Request inventory status response: " + this.status );
		}
	};

	// Send a GET request to 64.225.29.130/inventory/view
	xmlHttp.open( "GET", "http://64.225.29.130/orders/view", true );
	xmlHttp.send();

}

function showBill(obj, orderNo){

    var billStr;
    if (orderNo == 1)
        billStr = "";
    else
        billStr = document.getElementById('itemList').innerText

    billStr += "Order " + orderNo + ":\n";

    //create entire bill from object
    //items
    for (var i = 0; i < obj.items.length; i++){
        var itemNo = i + 1;
        billStr += itemNo + ". " + obj.items[i].name + "   " + obj.items[i].price + "\n";

        for (var j = 0; j < obj.items[i].ingredients.length; j++)
            billStr += "----" + obj.items[i].ingredients[j] + "\n";

    }

    //add subtotal, tax, and Total
    billStr += "\nSubtotal: $" + obj.subtotal + "\n";
    billStr += "Tax:      $" + obj.tax + "\n"
    billStr += "___________________________________________\n";
    billStr += "Total:    $" + obj.total + "\n\n";

    document.getElementById('itemList').innerText = billStr;
    //alert("test");


}

function compBill(compAmt){

    //order num to comp
    var orderToComp = document.getElementById('comp-order-num').value;

    //set table Number
    var table = Cookies.get('table-num');
    if (table == undefined) {
        table = 0;
    }
    document.getElementById('tableNum').innerText = table;


    //first, get list of orders
    var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) {
			//var doc = document.getElementById( 'textarea-view' );
			var txt ="";
			// Response is a JSON array of items
			var obj = JSON.parse( this.responseText );
            //get total number of tables
			var numBills = Object.keys(obj).length;
            //loop through bills

            var validOrders = 0;
            for (var i = 0; i < numBills; i++){
                if (table == obj[i].table && obj[i].status != 'paid') {
                    validOrders++;
                    if (validOrders == orderToComp){
                        sendComp(obj[i], compAmt);
                        return;
                    }
                }
            }
            document.getElementById('comp-response').innerHTML = 'No such order exists.';
        }

		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Request inventory status response: " + this.status );
		}
	};

	// Send a GET request to 64.225.29.130/inventory/view
	xmlHttp.open( "GET", "http://64.225.29.130/orders/view", true );
	xmlHttp.send();

    loadBill();

}

function sendComp(orderObj, compAmt){
    var comp = {};

    var serverID = sessionStorage.getItem('employee-id')

	// Get order payment data
	comp[ "_id" ] = orderObj._id;
	comp[ "amount" ] = compAmt;
	comp[ "server" ] = serverID;

    if (parseFloat(compAmt) > orderObj.total || parseInt(compAmt) > orderObj.total) {
        document.getElementById('comp-response').innerHTML = 'Comp amount cannot be greater than price of order.';
        return;
    }
    /*alert(order[ "_id" ]);
	alert(order[ "amount" ]);
	alert(order[ "method" ]);
	alert(order[ "receipt" ]);
	alert(order[ "tip" ]);
	alert(order[ "feedback" ]);
	alert(order[ "email" ]);*/
    alert(JSON.stringify( comp ));

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 )
		{
			//document.getElementById( "textarea-orders-pay" ).innerHTML = "Status response: " + this.status + "\n" + this.responseText;
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			//document.getElementById( "textarea-orders-pay" ).innerHTML = "Status response: " + this.status + "\n" + this.responseText;
		}
	};

	// Send a POST request to 64.225.29.130/orders/pay
	xmlHttp.open( "POST", "http://64.225.29.130/orders/comp" );
	xmlHttp.send( JSON.stringify( comp ) );
}

function splitBill(splitAmt){
    //entire string of bill
    var billStr = document.getElementById('itemList').innerText;
    var grandTotal = 0;
    var totalPlacement = 0;
    //find actual grand total
    for (var i = billStr.length - 1; i >= 0; i--){

        if (billStr[i] == "$") {
            grandTotal = billStr.substring(i + 1);
            totalPlacement = i;
            break;
        }
    }

    //calculate comp'd amount
    grandTotal = +grandTotal - +splitAmt;
    grandTotal = grandTotal.toFixed(2);

    //update bill
    document.getElementById('itemList').innerText = billStr.substring(0, totalPlacement) + grandTotal;
}

function applyCoupon(code){

    //first, get list of coupons
    var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) {
			//var doc = document.getElementById( 'textarea-view' );
			var txt ="";
			// Response is a JSON array of items
			var obj = JSON.parse( this.responseText );
            //get total number of coupons
			var numCoupons = Object.keys(obj).length;

            //loop through coupons
            for (var i = 0; i < numCoupons; i++){
                if (obj[i]._id == code){
                    alert(obj[i].id +"\n"+code);
                    compBill(obj[i].discount);
                }
            }
        }

		else if( this.readyState == 4 && this.status != 200 ){
			console.log( "Request inventory status response: " + this.status );
		}
	};

	// Send a GET request to 64.225.29.130/inventory/view
	xmlHttp.open( "GET", "http://64.225.29.130/coupons/view", true );
	xmlHttp.send();

}

function sendPayment(){
    //set table Number
    var table = Cookies.get('table-num');
    if (table == undefined) {
        table = 0;
    }
    document.getElementById('tableNum').innerText = table;


    //first, get list of orders
    var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) {
			//var doc = document.getElementById( 'textarea-view' );
			var txt ="";
			// Response is a JSON array of items
			var obj = JSON.parse( this.responseText );
            //get total number of tables
			var numBills = Object.keys(obj).length;
            //loop through bills

            var order = 0;
            var totalPrice = 0;
            for (var i = 0; i < numBills; i++){
                if (table == obj[i].table && obj[i].status != 'paid') {
                    payOrder(obj[i]);
                }
            }

        }

		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Request orders status response: " + this.status );
		}
	};

	// Send a GET request to 64.225.29.130/inventory/view
	xmlHttp.open( "GET", "http://64.225.29.130/orders/view", true );
	xmlHttp.send();
}

function payOrder(orderObj)
{
	var order = {};

	// Get order payment data
	order[ "_id" ] = orderObj._id;
	order[ "amount" ] = orderObj.total;
	order[ "method" ] = document.getElementsByName( "payment-method" )[ 0 ].value;
	order[ "receipt" ] = document.getElementsByName( "receipt-method" )[ 0 ].value;
	order[ "tip" ] = document.getElementsByName( "tip-amount" )[ 0 ].value;
	order[ "feedback" ] = document.getElementsByName( "feedback" )[ 0 ].value;
	order[ "email" ] = document.getElementsByName( "email" )[ 0 ].value;

    /*alert(order[ "_id" ]);
	alert(order[ "amount" ]);
	alert(order[ "method" ]);
	alert(order[ "receipt" ]);
	alert(order[ "tip" ]);
	alert(order[ "feedback" ]);
	alert(order[ "email" ]);*/
    alert(JSON.stringify( order ));

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 )
		{
			document.getElementById( "textarea-orders-pay" ).innerHTML = "Status response: " + this.status + "\n" + this.responseText;
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			document.getElementById( "textarea-orders-pay" ).innerHTML = "Status response: " + this.status + "\n" + this.responseText;
		}
	};

	// Send a POST request to 64.225.29.130/orders/pay
	xmlHttp.open( "POST", "http://64.225.29.130/orders/pay" );
	xmlHttp.send( JSON.stringify( order ) );
}

module.exports = {loadBill,showBill, compBill, sendComp, splitBill, applyCoupon, sendPayment,payOrder} ;

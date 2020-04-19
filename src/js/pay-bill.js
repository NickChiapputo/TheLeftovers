// getting orders for current table from databse
function getOrdersByTable(tip)
{
    $(document).ready(function() {
        var table = (sessionStorage.getItem('tableid'));
        // making new payment object
        var payment = Cookies.get('payment');
        if( payment == null )
        {
            payment = {}
            payment['tip'] = '';
            payment['note'] = '';
            payment['payment'] = '';
            payment['receipt'] = '';
            payment['amount'] = '';
            payment['email'] = '';
            Cookies.set('payment', payment, {path: '/', sameSite: 'strict'});
        }
        if (table == undefined) {
            table = 0;
        }

        // displaying table's orders
        document.getElementById('tableNum').innerText = table;
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if( this.readyState == 4 && this.status == 200 ) 
            {

                // Response is a JSON array of items
                var obj = JSON.parse( this.responseText );
                
                var numItems = Object.keys( obj ).length;
                var out = "Number of Orders: " + numItems + "\n\n";
            
                var i, p;
                var k = 0;
                var output = "";
                var order;
                var subtotal=0;
                var total=0;
                var tax=0;
                var paid=0;
                var billExists = false;
                var billOrders = [{}];

                for( p = 0; p < numItems; p++ ) {
                    if (obj[p].table == table && obj[p].status != 'paid' && obj[p].status != 'ordered') {
                        obj[p].tip = 0;
                        billOrders.push(obj[p]);
                    }
                }

                // multiple active orders can exist. Printing every active order
                for( p = 1; p < billOrders.length; p++ ) {
                        billExists = true;
                        out += 	  "Order " + ( p + 1 ) + " (" + billOrders[ p ][ "status" ] + "): " + billOrders[ p ][ "_id" ] + "\n"
                                + "    Table:     " + billOrders[ p ][ "table"] + "\n"
                                + "    Subtotal: $" + billOrders[ p ][ "subtotal" ] + "\n"
                                + "    Tax:      $" + billOrders[ p ][ "tax" ] + "\n"
                                + "    Tip::     $" + tip + "\n";
                                + "    Total:    $" + billOrders[ p ][ "total" ] + "\n\n";
                        subtotal += billOrders[p].subtotal;
                        tax += billOrders[p].tax;
                        total += billOrders[p].total;
                        order = billOrders[p];
                        for (i=0; i < order.items.length; i++) {
                            k++
                            // printing name, price, discount
                            output = output.concat(k, ". ");
                            if (document.getElementById('pageTitle').innerText == "View Order") {
                                output = output.concat('(sent) ');
                            }
                            output = output.concat(order.items[i].name, " $", order.items[i].price);
                            if (order.items[i].happy_hour != undefined) {
                                output = output.concat(' (happy hour discount!)');
                            }
                                        
                            output = output.concat('\n');
                            for (j=0; j < order.items[i].ingredients.length; j++) {
                                if (order.items[i].hasIngredient[j] == '1') {
                                    output = output.concat('----', order.items[i].ingredients[j], '\n');
                                }
                            }
                            output = output.concat('\n');
                        }
                }

                // recording current orders and printing them
                window.localStorage.setItem('bill_orders', JSON.stringify(billOrders));
                if (billExists == true) {
                    paid = (subtotal + tax - total);
                    out += "\n";
                    console.log(out);
                    var roundedTip = addTrailingZeros( parseFloat( tip ) );
                    console.log( typeof total );
                    console.log( typeof roundedTip );
                    console.log( "Tip: $" + roundedTip );
                    output += "Subtotal: $" + addTrailingZeros(subtotal) + '\n';
                    output += "Tax: $" + addTrailingZeros(tax) + '\n';
                    output += "Tip: $" + roundedTip + '\n';
                    output += 'Paid: $' + addTrailingZeros(paid) + '\n';
                    output += '___________________________________________\n';
                    output += 'Total: $' + addTrailingZeros(total + parseFloat( roundedTip ) ) + '\n';
                    document.getElementById('itemList').innerText = output;
                }
                else {
                    document.getElementById('itemList').innerText = "When the kitchen finishes your order, you'll see it here";
                }
            }
            else if( this.readyState == 4 && this.status != 200 )
            {
                console.log( "Orders status response: " + this.status );
            }
        };

        // Send a GET request to 64.225.29.130/inventory/view
        xmlHttp.open( "GET", "http://64.225.29.130/orders/view", true );
        xmlHttp.send();
    });
}

// add tip to payment object
function addTip() {
    var tip = document.getElementById("tip-input").value;
    if (tip < 0) {
        return;
    }
    var payment = Cookies.getJSON('payment');
    payment.tip = tip;
    console.log( "Tip: " + tip );
    Cookies.set('payment', payment, {path: '/', sameSite: 'strict'});
    document.getElementById('tip-label').innerText = "Tip: $" + tip;

    getOrdersByTable( tip );
}

// clearing note left for server
function clearNote() {
    var note = document.getElementById("note");
    note.value = '';
    var payment = Cookies.getJSON('payment');
    payment ['note'] = note.value;
    Cookies.set('payment', payment, { path: '/', sameSite: 'strict'});
}

// retrieving server note
function loadNote() {
    var payment = Cookies.getJSON('payment');
    document.getElementById('note-body').innerText = payment.note;
}

// submitting note for server
function submitNote() {
    var payment = Cookies.getJSON('payment');
    var note = document.getElementById("note");
    if (note.value == '') {
        return;
    }
    $('#note-sent').modal('show')
    console.log(note.value)
    payment ['note'] = note.value;
    Cookies.set('payment', payment, { path: '/', sameSite: 'strict'});
    note.value = '';
    console.log("sent");
}

// called after clicking pay button
// loading payment and reciept options
function getOptions() {
    document.getElementById('pay-text').style.color = 'black';
    var payment = Cookies.getJSON('payment');
    payment.payment = document.getElementsByName( "order-pay-method" )[ 0 ].value;
    payment.receipt = document.getElementsByName( "order-receipt-method" )[ 0 ].value;
    var email = document.getElementById('email-input');

    // getting user email if relevant
    if (payment.receipt == "email" && payment.payment != "N/A" && (payment.email == undefined || payment.email.length == 0)) {
        email.style.display = 'unset';
        email.value = '';
        document.getElementById('pay-foot').style.display = 'unset';
        document.getElementById('submitEmail').style.display = 'unset';
        document.getElementById('yesnoPay').style.display = 'none';
        document.getElementById('pay-text').innerText = "Enter your email address to receive your receipt";
        Cookies.set('payment', payment, {path: '/', sameSite: 'strict'});
        return;
    }
    else {
        email.style.display = 'none';
        document.getElementById('pay-foot').style.display = 'none';
        document.getElementById('yesnoPay').style.display = 'unset';
        document.getElementById('submitEmail').style.display = 'none';
    }

    // errors are displayed in red
    Cookies.set('payment', payment, {path: '/', sameSite: 'strict'});
    var payText = document.getElementById('pay-text');
    payText.style.color = 'red';
    var bill_orders = JSON.parse(window.localStorage.getItem('bill_orders'));

    // checking for upaid orders
    var isItEmpty = true;
    for (var i=1; i < bill_orders.length; i++) {
        if (bill_orders[i].status != 'paid') {
            isItEmpty = false;
            break;
        }
    }
    console.log(bill_orders.length)

    // if no unpaid orders, don't let customer pay
    if (isItEmpty == true) {
        document.getElementById('pay-foot').style.display = 'none';
        payText.style.color = "green"
        payText.innerText = "Bill has been paid. Have a great day! :)";
    }

    // informing user that they need to enter email and payment info
    else if (payment.payment == "N/A" && payment.receipt == "N/A") {
        document.getElementById('pay-foot').style.display = 'none';
        payText.innerText = 'No payment method selected';
        payText.innerText = payText.innerText.concat('\nNo receipt method selected');
    }
    else if (payment.payment == "N/A") {
        document.getElementById('pay-foot').style.display = 'none';
        payText.innerText = 'No payment method selected';
    }
    else if (payment.receipt == "N/A") {
        document.getElementById('pay-foot').style.display = 'none';
        payText.innerText = 'No receipt method selected';
    }
    else {
        document.getElementById('pay-foot').style.display = 'unset';
        payText.style.color = "black"
        payText.innerText = "Pay for your order in parts or all together"
    }
}

// handling payments
function handlePayment(frac) {
    var payment = Cookies.getJSON('payment');
    
    // fractioonal or whole payments
    if (frac == 'F') {
        payment.amount = document.getElementById('partial-pay-amount').value;
        document.getElementById('partial-pay-amount').value = 0;
        if (payment.amount <= 0) {
            document.getElementById('noGame').style.display = 'unset';
            document.getElementById('playGame').style.display = 'none';
            document.getElementById('pay-success-title').innerText = "Invalid input";
            document.getElementById('pay-success-title').style.color = "red";
            document.getElementById('pay-success-text').innerText = "Enter a number above 0";
            return;
        }
    }
    else {
        var bill_orders = JSON.parse(window.localStorage.getItem('bill_orders'));
        var i;
        payment.amount = 0;
        for (i = 1; i < bill_orders.length; i++) {
            payment.amount += bill_orders[i].total;
        }
    }

    if (payment.tip.length <= 0) {payment.tip = 0}
    var totalPaid = Number(payment.amount + Number(payment.tip));

    // processing order payments and printing status to modal window
    document.getElementById('pay-success-title').innerText = "Successfully paid $" + Number(totalPaid);
    document.getElementById('pay-success-title').style.color = 'green';
    var tip = payment.tip;
    console.log( "Tip: " + tip );

    // buildPayments prepares payment data to be sent to the database
    var total = buildPayments(payment);
    var sucText = document.getElementById('pay-success-text');

    // printing more output data
    total = (Number(total.toFixed(2))).toString();
    if (total < 0) {
        sucText.innerText = "Paid: $" + Number(payment.amount) + "\n+ Tip: $" + tip + "\nNot charged: $" + total-payment.amount;
    }
    else {
        sucText.innerText = "Paid: $" + Number(payment.amount) + "\n+ Tip: $" + tip + "\nRemaining: $" + total;
    }
    sucText.style.textAlign = 'left';
    Cookies.set('payment', payment, {path: '/', sameSite: 'strict'});

    var payments = JSON.parse(window.localStorage.getItem('payments'));

    // sending payment data to server
    for (var i=0; i < payments.length; i++) {
        sendPayment(payments[i]);
    }

    // removing current order if full order is paid
    if (total <= 0) {
        sessionStorage.removeItem('current_order');
        document.getElementById('noGame').style.display = 'none';
        document.getElementById('playGame').style.display = 'unset';
    }
    else {
        document.getElementById('noGame').style.display = 'none';
        document.getElementById('playGame').style.display = 'unset';
    }

    // reloading bill
    getOrdersByTable();
    document.getElementsByName( "order-pay-method" )[ 0 ].value = "N/A";
    document.getElementsByName( "order-receipt-method" )[ 0 ].value = "N/A";
}

// building payment data
function buildPayments(payment) {
    var saveTip = payment.tip;
    money = Number(payment.amount);
    var payments = [{}];

    // getting orders
    var orders = JSON.parse(window.localStorage.getItem('bill_orders'));
    var total = (money * -1);
    for (i=1; i < orders.length; i++) {

        // building payment object for every order that's paid for
        total += orders[i].total;
        var newPayment = new Object();
        newPayment.tip = payment.tip;
        newPayment.payment = payment.payment;
        newPayment.receipt = payment.receipt;
        newPayment.note = payment.note;
        newPayment.amount = 0;
        newPayment.email = payment.email;
        newPayment ['_id'] = orders[i]._id;

        //only paying for unpaid orders
        if (orders[i].status != 'paid') {
            payment.tip = 0;
            // paying for whole order object
            if (money >= orders[i].total) {
                newPayment.amount = orders[i].total;
                money = money - orders[i].total;
                orders[i].total = 0;
                orders[i].status = 'paid';
            }
            // paying for part of order object
            else {
                newPayment.amount = money;
                orders[i].total = orders[i].total - money;
                money = 0
            }
        }
        payments.push(newPayment);
    }

    // recording payment and order objects
    payments.splice(0,1);
    window.localStorage.setItem('payments', JSON.stringify(payments));
    window.localStorage.setItem('bill_orders', JSON.stringify(orders));

    if (money > 0) {
        document.getElementById('pay-success-title').innerText = "Successfully paid full order";
    }
    return total;
}

// sending
function sendPayment(payment)
{
    var order = {};

	// Get order payment data
	order[ "_id" ] = payment._id;
	order[ "amount" ] = payment.amount;
	order[ "method" ] = payment.payment;
	order[ "receipt" ] = payment.receipt;
	order[ "tip" ] = payment.tip;
    order[ "feedback" ] = payment.note;
	order[ "email" ] = payment.email;
    console.log("ORDER: ", order);

    // beaming it to the cloud
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 )
		{
			console.log("Status response: " + this.status + "\n" + this.responseText);
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log("Status response: " + this.status + "\n" + this.responseText);
		}
	};

	// Send a POST request to 64.225.29.130/orders/pay
	xmlHttp.open( "POST", "http://64.225.29.130/orders/pay" );
    xmlHttp.send( JSON.stringify( order ) );
}

// recording and displaying email
function submitEmail() {
    var payment = Cookies.getJSON('payment');
    var email = document.getElementById('email-input').value;
    
    if (email.length < 1) {
        document.getElementById('pay-text').innerText = "Empty email field";
        document.getElementById('pay-text').style.color = 'red';
        return;
    }
    else {
        payment['email'] = email;
        Cookies.set('payment', payment, {path: '/', sameSite: 'strict'});
        getOptions();
    }
}



module.exports = {submitEmail, sendPayment, buildPayments, handlePayment, getOptions, submitNote, loadNote, clearNote, getOrdersByTable, addTip} ;

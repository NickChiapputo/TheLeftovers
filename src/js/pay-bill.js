function getOrdersByTable()
{
    $(document).ready(function() {
        var table = Cookies.get('table-num');
        var payment = Cookies.get('payment');
        if (payment == undefined) {
            payment = {}
            payment['tip'] = '';
            payment['note'] = '';
            payment['payment'] = '';
            payment['receipt'] = '';
            payment['amount'] = '';
            Cookies.set('payment', payment, {path: '/', sameSite: 'strict'});
            console.log(payment);
        }
        if (table == undefined) {
            table = 0;
        }
        document.getElementById('tableNum').innerText = table;
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if( this.readyState == 4 && this.status == 200 ) 
            {
                //var doc = document.getElementById( 'textarea-orders-view' );

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
                    if (obj[p].table == table) {
                        billExists = true;
                        billOrders.push(obj[p]);
                        out += 	  "Order " + ( p + 1 ) + " (" + obj[ p ][ "status" ] + "): " + obj[ p ][ "_id" ] + "\n"
                                + "    Table:     " + obj[ p ][ "table"] + "\n"
                                + "    Subtotal: $" + obj[ p ][ "subtotal" ] + "\n"
                                + "    Tax:      $" + obj[ p ][ "tax" ] + "\n"
                                + "    Total:    $" + obj[ p ][ "total" ] + "\n\n";
                        subtotal += obj[p].subtotal;
                        tax += obj[p].tax;
                        total += obj[p].total;
                        paid += (subtotal + tax - total);
                        order = obj[p];
                        for (i=0; i < order.items.length; i++) {
                            k++
                            // printing name, price, discount
                            output = output.concat(order.table, ". ");
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
                }
                if (billExists == true) {
                    billOrders.splice(0, 1);
                    window.localStorage.setItem('bill_orders', JSON.stringify(billOrders));
                    out += "\n";
                    console.log(out);
                    output += "Subtotal: $" + addTrailingZeros(subtotal) + '\n';
                    output += "Tax: $" + addTrailingZeros(tax) + '\n';
                    output += 'Paid: $' + addTrailingZeros(paid) + '\n';
                    output += '___________________________________________\n';
                    output += 'Total: $' + addTrailingZeros(total) + '\n';
                    document.getElementById('itemList').innerText = output;
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

function addTip() {
    //window.localStorage.setItem('bill_orders', JSON.stringify(billOrders));
    var tip = document.getElementById("tip-input").value;
    var payment = Cookies.getJSON('payment');
    payment.tip = tip;
    Cookies.set('payment', payment, {path: '/', sameSite: 'strict'});
    console.log(payment);
    document.getElementById('tip-label').innerText = "Tip: $" + tip;
}

function clearNote() {
    var note = document.getElementById("note");
    note.value = '';
    var payment = Cookies.getJSON('payment');
    payment ['note'] = note.value;
    Cookies.set('payment', payment, { path: '/', sameSite: 'strict'});
}

function submitNote() {
    var payment = Cookies.getJSON('payment');
    var note = document.getElementById("note");
    document.getElementById('note-body').innerText = note.value;
    console.log(note.value)
    payment ['note'] = note.value;
    Cookies.set('payment', payment, { path: '/', sameSite: 'strict'});
    console.log(payment);
    note.value = '';
    var noteSuc = document.getElementById('note-success');
    noteSuc.innerText = "\nNote will be sent to your server";
    noteSuc.style.color = "green";
    noteSuc.style.display = "unset";
    console.log("sent");
}

function getOptions() {
    var payment = Cookies.getJSON('payment');
    payment.payment = document.getElementsByName( "order-pay-method" )[ 0 ].value;
    payment.receipt = document.getElementsByName( "order-receipt-method" )[ 0 ].value;
    Cookies.set('payment', payment, {path: '/', sameSite: 'strict'});
    console.log(payment);
    var payText = document.getElementById('pay-text');
    payText.style.color = 'red';
    if (payment.payment == "N/A" && payment.receipt == "N/A") {
        payText.innerText = 'No payment method selected';
        payText.innerText = payText.innerText.concat('\nNo receipt method selected');
    }
    else if (payment.payment == "N/A") {
        payText.innerText = 'No payment method selected';
    }
    else if (payment.receipt == "N/A") {
        payText.innerText = 'No receipt method selected';
    }
    else {
        document.getElementById('pay-foot').style.display = 'unset';
        payText.style.color = "black"
        payText.innerText = "Pay for your order in parts or all together"
    }
    console.log("NaN: ", payment.payment, ", ", payment.receipt);
}

function handlePartialPayment(frac) {
    if (frac == 'W') {
        var payAmount = document.getElementById('partial-pay-amount').value;
    }
    else {
        var pay
    }
    console.log("Pay amount: ", payAmount);
    var payment = Cookies.getJSON('payment');
    payment.amount = payAmount;
    Cookies.set('payment', payment, {path: '/', sameSite: 'strict'});
}
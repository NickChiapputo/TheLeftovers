function customerCouponVerification()
{
    var coupon = {};

	// Get coupon information
    coupon[ "_id" ] = document.getElementById( "coupon-input" ).value;
    document.getElementById( "coupon-input" ).value = '';
    //coupon[ "_id" ] = id;
    console.log(coupon);

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) 
		{
            var coupon = JSON.parse( this.responseText );
            window.localStorage.setItem('coupon', coupon);
            console.log( "Verification result: " + this.responseText );
            addCoupon(coupon);
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
            console.log( "Status return: " + this.status + "\n" );
            failCoupon();
		}
	};

	console.log( "Sending: " + JSON.stringify( coupon ) );

	// Send a POST request to 64.225.29.130/coupon/verify
	xmlHttp.open( "POST", "http://64.225.29.130/coupons/verify", false );
	xmlHttp.send( JSON.stringify( coupon ) );
}

function addCoupon(coupon) {
    console.log("COUPON: ", coupon);
    // setting modal window output
    document.getElementById('coupon-success-title').innerText = "Coupon added!";
    document.getElementById('coupon-success-title').style.color = 'green';
    document.getElementById('coupon-success-body').style.display = 'unset';
    document.getElementById('coupon-success-text').style.textAlign = 'left';
    document.getElementById('coupon-foot-fail').style.display = 'none';
    document.getElementById('coupon-foot-success').style.display = 'unset';

    // calculating coupon amount and sending payment
    var total = 0;
    var bill_orders = JSON.parse(window.localStorage.getItem('bill_orders'));
    for (var i=1; i < bill_orders.length; i++) {
        total += bill_orders[i].total;
    }
    console.log("TOTAL: ", total);
    var percent = total * coupon.discount / 100;
    percent = (Number(percent.toFixed(2))).toString();

    document.getElementById('coupon-success-text').innerText = 'Discount %' + coupon.discount + '\n$' + percent + ' deducted\n' + coupon.rewards;
    document.getElementById('partial-pay-amount').value = percent;
    console.log("PERCENT: ", percent);
    var payment = {};
    payment['receipt'] = 'print';
    payment['tip'] = 0;
    payment['payment'] = 'cash';
    Cookies.set('payment', payment);
    handlePayment('F');
    console.log("DONE");
    document.getElementById('partial-pay-amount').value = '';
}

function failCoupon() {
    // setting modal window output
    document.getElementById('coupon-success-title').innerText = "Invalid coupon";
    document.getElementById('coupon-success-title').style.color = 'red';
    document.getElementById('coupon-success-body').style.display = 'none';
    document.getElementById('coupon-foot-fail').style.display = 'unset';
    document.getElementById('coupon-foot-success').style.display = 'none';
}
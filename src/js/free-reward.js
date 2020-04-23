// post-payment game
function getFreeReward(){
    var userNum = document.getElementById("user-input-number").value;

    if (userNum < 1 || userNum > 6) alert("Number not in range! Try again 😜")
    else if (userNum == randomNumber(1,6))
    {
        // creating coupon and displaying it's ID if customer guesses the number
        createGameCoupon();
        var code = sessionStorage.getItem('couponCode');
        console.log(code);
        code = "You won a free desert!😀\nsave this coupon code:\n".concat(code);
        alert(code);
        sessionStorage.removeItem('couponCode');
        // returning to homepage
        window.location="index.html";
    }
    else
    { 
        // alerting the user that they lost the game and returning to the homepage
        alert("Sorry! better luck next time ☹️");
        window.location="index.html";
    }
}

// generating random number for game
function randomNumber(min, max) { 
	return Math.floor(Math.random() * (max - min) + min); 
} 

// creating coupon for winning customer
function createGameCoupon()
{
	var coupon = {};

	// recording coupon data
	coupon[ "name" ] = 'free dessert';
    coupon[ "discount" ] = '100';
    var expDate = new Date();
    if (expDate.getMonth() >= 11) {
        expDate.setFullYear(expDate.getFullYear() + 1);
        expDate.setMonth(0);
    }
    else {
        expDate.setMonth(expDate.getMonth() + 1);
    }
	coupon[ "expiration" ] = expDate.toISOString().substr(0, 10);
    coupon[ "rewards" ] = 'free dessert';
    console.log(coupon);

    // creating coupon and recording ID
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) 
		{
			var obj = JSON.parse( this.responseText );

			console.log( "New Coupon: " + this.responseText );
			
			// for( var attr in obj )
            // 	document.getElementById( "textarea-order-create" ).innerHTML += "    " + attr + ": "  + obj[ attr ];
            sessionStorage.setItem('couponCode', obj._id);
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			console.log( "Status return: " + this.status + "\n" );
        }
	};

	console.log( "Sending: " + JSON.stringify( coupon ) );

	// Send a POST request to 64.225.29.130/employees/create
	xmlHttp.open( "POST", "http://64.225.29.130/coupons/create", false );
	xmlHttp.send( JSON.stringify( coupon ) );
}


module.exports = {getFreeReward, randomNumber} ;

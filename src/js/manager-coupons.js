/*******************************************/
/*            Employee Functions           */
function getCoupons()
{
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) 
		{
			var doc = document.getElementById( 'textarea-coupons-view' );

			// Response is a JSON array of items
			var obj = JSON.parse( this.responseText );
			
			var numItems = Object.keys( obj ).length;
			
		
			var i;
			var txt="";
			txt += "<table style='width:100%; border: 1px solid black;'>" + "<tr><th style=' background-color: black; color: white;'>CID</th><th style=' background-color: black; color: white;'>Text</th><th style=' background-color: black; color: white;'>Discount%</th><th style=' background-color: black; color: white;'>ExpirationDate</th><th style=' background-color: black; color: white;'>Rewards</th></tr>";
			for( i = 0; i < numItems; i++ )
			{
				var coupon = obj[ i ];
				txt +="<tr><td style=' background-color: white; color: black;'>" + coupon._id + "</td><td style=' background-color: white; color: black;'>"
				+coupon.name + "</td><td style=' background-color: white; color: black;'>" 
				+coupon.discount + "</td><td style=' background-color: white; color: black;'>"
				+coupon.expiration + "</td><td style=' background-color: white; color: black;'>"
				+coupon.rewards + "</td></tr>";
			}
			doc.innerHTML +=txt;
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			document.getElementById( 'textarea-coupons-view' ).innerHTML = "Coupon query response: " + this.status;
			console.log( "Coupon query response: " + this.status );
		}
	};

	// Send a GET request to 64.225.29.130/coupons/view
	xmlHttp.open( "GET", "http://64.225.29.130/coupons/view", true );
	xmlHttp.send();
}

function createCouponSubmit()
{
	var coupon = {};

	// Get coupon data
	coupon[ "name" ] = document.getElementsByName( "name" )[ 0 ].value;
	coupon[ "discount" ] = document.getElementsByName( "discount" )[ 0 ].value;
	coupon[ "expiration" ] = document.getElementsByName( "expiration" )[ 0 ].value;
	coupon[ "rewards" ] = document.getElementsByName( "rewards" )[ 0 ].value;

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) 
		{
			// var obj = JSON.parse( this.responseText );

			document.getElementById( "textarea-create" ).innerHTML = "New Coupon: " + this.responseText;
			
			// for( var attr in obj )
			// 	document.getElementById( "textarea-order-create" ).innerHTML += "    " + attr + ": "  + obj[ attr ];
		
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			document.getElementById( "textarea-create" ).innerHTML = "Status return: " + this.status; + "\n";
		}
	};

	console.log( "Sending: " + JSON.stringify( coupon ) );

	// Send a POST request to 64.225.29.130/employees/create
	xmlHttp.open( "POST", "http://64.225.29.130/coupons/create", true );
	xmlHttp.send( JSON.stringify( coupon ) );
}

function couponVerificationSubmit()
{
	var coupon = {};

	// Get coupon information
	coupon[ "_id" ] = document.getElementsByName( "coupon-verification-id" )[ 0 ].value;

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) 
		{
			document.getElementById( "textarea-coupon-verification" ).innerHTML = "Verification result: " + this.responseText;
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			document.getElementById( "textarea-coupon-verification" ).innerHTML = "Status return: " + this.status; + "\n";
		}
	};

	console.log( "Sending: " + JSON.stringify( coupon ) );

	// Send a POST request to 64.225.29.130/coupon/verify
	xmlHttp.open( "POST", "http://64.225.29.130/coupons/verify", true );
	xmlHttp.send( JSON.stringify( coupon ) );
}

function couponDeleteSubmit()
{
	var params = {};
	params[ "_id" ] = document.getElementsByName( "coupon-delete-id" )[ 0 ].value;

	var xmlHttp = new XMLHttpRequest();

	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 )
		{
			console.log( this.responseText );

			// Response is a JSON object
			var obj = JSON.parse( this.responseText );

			if( obj == null || obj.ok != 1 || obj.n != 1 )
				document.getElementById( 'textarea-coupon-delete' ).innerHTML = "Unable to delete coupon.\n";
			else
				document.getElementById( 'textarea-coupon-delete' ).innerHTML = "Deleted Coupon\n";
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			document.getElementById( 'textarea-coupon-delete' ).innerHTML = "Delete coupon status response: " + this.status;
			console.log( "Delete coupon status response: " + this.status );
		}
	};

	// Send a POST request to 64.225.29.130/coupons/delete
	xmlHttp.open( "POST", "http://64.225.29.130/coupons/delete", true );
	xmlHttp.send( JSON.stringify( params ) );
}
/*******************************************/
function getRewardsAccounts()
{
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) 
		{
			var doc = document.getElementById( 'textarea-rewards-accounts-view' );

			console.log( this.responseText );
		
			// Response is a JSON array of items
			var obj = JSON.parse( this.responseText );
			
			var numItems = Object.keys( obj ).length;
			doc.innerHTML = "Number of Rewards Accounts: " + numItems + "\n";

			var i;
			for( i = 0; i < numItems; i++ )
			{
				var currItem = obj[ i ];
				doc.innerHTML += "Item " + ( i + 1 ) + "\n" + 
						"    Name:  " + currItem.name + "\n" + 
						"    Phone Number: " + currItem[ "_id" ] + "\n" + 
						"    Last Order: " + currItem[ "lastMeal" ] + "\n\n";
			}

			console.log( this.responseText );
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			document.getElementById( 'textarea-rewards-accounts-view' ).innerHTML = "Rewards accounts status response: " + this.status;
			console.log( "Rewards accounts status response: " + this.status );
		}
	};

	// Send a GET request to 64.225.29.130/inventory/view
	xmlHttp.open( "GET", "http://64.225.29.130/rewards/view", true );
	xmlHttp.send();
	return xmlHttp
}

function createRewardsAccount()
{
	var params = {};
	params[ "phone" ] = document.getElementsByName( "rewards-account-phone" )[ 0 ].value;
	params[ "name" ] = document.getElementsByName( "rewards-account-name" )[ 0 ].value;

	var xmlHttp = new XMLHttpRequest();

	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 )
		{
			var obj = JSON.parse( this.responseText );
			document.getElementById( 'textarea-rewards-accounts-create' ).innerHTML = "New Account: \n" + 
				"    Name: " + obj[ "name" ] + "\n" + 
				"    Phone Number: " + obj[ "_id" ] + "\n" + 
				"    Last Meal: " + obj[ "lastMeal" ] + "\n";
            console.log( this.responseText );
            sessionStorage.setItem('rewards-name-save',obj[ "name" ]);
            sessionStorage.setItem('rewards-number-save',obj[ "_id" ]);
            sessionStorage.setItem('rewards-meal-save',obj[ "lastMeal" ]);
           // window.location="log.html";
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			document.getElementById( 'textarea-rewards-accounts-create' ).innerHTML = "Create rewards account status response: " + this.status;
			console.log( "Create rewards account status response: " + this.status );
		}
	};

	// Send a POST request to 64.225.29.130/rewards/create with selected parameters
	xmlHttp.open( "POST", "http://64.225.29.130/rewards/create", true );
    xmlHttp.send( JSON.stringify( params ) );
}

function createRewardsAccountSubmit()
{
	createRewardsAccount();
	// Function must return false to prevent reloading of page
	return false;
}

function logRewardsAccounts()
{
	var params = {};
	params[ "phone" ] = document.getElementById( 'textarea-rewards-accounts-log' ).value;

	var xmlHttp = new XMLHttpRequest();

	xmlHttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 )
		{
			var obj = JSON.parse( this.responseText );
			document.getElementById( 'textarea-rewards-accounts-log' ).innerHTML = "Logged into: \n" + 
				"    Name: " + obj[ "name" ] + "\n" + 
				"    Phone Number: " + obj[ "_id" ] + "\n" + 
				"    Last Meal: " + obj[ "lastMeal" ] + "\n";
			console.log( this.responseText );
			sessionStorage.setItem('rewards-name-save',obj[ "name" ]);
			sessionStorage.setItem('rewards-number-save',obj[ "_id" ]);
			if( obj[ "lastMeal" ] == null ) sessionStorage.setItem('rewards-meal-save', "Not Available");
			else
			{
				obj[ "lastMeal" ].forEach(function (meal) {
					sessionStorage.setItem('rewards-meal-save', meal.name);
					sessionStorage.setItem('rewards-meal-image-save', meal.image);
					alert(meal.image)
			
				});
			}
            window.location="log.html";
		}
		else if( this.readyState == 4 && this.status != 200 )
		{
			document.getElementById( 'textarea-rewards-accounts-log' ).innerHTML = "Log into rewards account status response: " + this.status;
			console.log( "Log into rewards account status response: " + this.status );
		}
	};

	// Send a POST request to 64.225.29.130/rewards/create with selected parameters
	xmlHttp.open( "POST", "http://64.225.29.130/rewards/search", true );
	xmlHttp.send( JSON.stringify( params ) );
	module.exports = {getRewardsAccounts,createRewardsAccount,logRewardsAccounts}
}

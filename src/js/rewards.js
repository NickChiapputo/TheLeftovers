function createRewardsAccount()
{
	var phone = document.getElementsByName( "rewards-account-phone" )[ 0 ].value;
	var name = document.getElementsByName( "rewards-account-name" )[ 0 ].value;

	if( phone === undefined || phone === "" || phone.length !== 10 || isNaN( phone ) || !( /[0-9]{10}/.test( phone ) ) )
	{
		alert( 'Invalid phone number!\nPlease enter your 10-digit phone number with no special characters.' );
		return;
	}

	if( name === undefined || name === "" )
	{
		alert( 'Invalid name!\nPlease enter your name so we know who you are.' );
		return;
	}

	var params = {};
	params[ "phone" ] = phone;
	params[ "name" ] = name;

	var response = communicateWithServer( JSON.stringify( params ), "POST", "http://64.225.29.130/rewards/create", false );

	if( response.status === 200 )
	{
		console.log( response.responseText );

		var obj = JSON.parse( response.responseText );

		sessionStorage.setItem( 'rewards-name-save', obj[ "name" ] );
		sessionStorage.setItem( 'rewards-number-save', obj[ "_id" ] );
		sessionStorage.removeItem( 'rewards-meal' );

		alert( 'Account successfully created!\nYour ID is: ' + obj[ "_id" ] );

		location = 'index.html';
	}
	else
	{
		alert( 'Account already exists!' );
	}
}

function logRewardsAccounts()
{
	var rewardsAccountNumber = document.getElementById( 'textarea-rewards-accounts-log' ).value

	if( rewardsAccountNumber === null || rewardsAccountNumber === "" || 
		rewardsAccountNumber.length !== 10 || isNaN( rewardsAccountNumber ) || 
		!( /[0-9]{10}/.test( rewardsAccountNumber ) ) )
	{
		alert( 'Invalid phone number.\nPlease enter a 10 digit phone number with no special characters.' );
		return;
	}

	var params = {};
	params[ "phone" ] = rewardsAccountNumber;

	// Send rewards query to server
	var response = communicateWithServer( JSON.stringify( params ), "POST", "http://64.225.29.130/rewards/search", false );

	// If rewards account is found, set session storage and return to main menu
	// Otherwise, inform user no rewards account was found
	if( response.status === 200 )
	{
		// Get JSON object of rewards account
		var obj = JSON.parse( response.responseText );

		// Save rewards account name and number
		sessionStorage.setItem('rewards-name-save',obj[ "name" ]);
		sessionStorage.setItem('rewards-number-save',obj[ "_id" ]);

		// If rewards account contains previous order, save it.
		// Otherwise, ensure session storage does not contain any data
		if( obj[ "lastMeal" ] !== null )
		{
			sessionStorage.setItem( 'rewards-meal', JSON.stringify( obj[ "lastMeal" ] ) );
		}
		else
		{
			sessionStorage.removeItem( 'rewards-meal' );
		}

        window.location="log.html";
	}
	else
	{
		document.getElementById( 'textarea-rewards-accounts-log' ).innerHTML = "Log into rewards account status response: " + this.status;
		console.log( "Log into rewards account status response: " + response.status );
		alert( 'No rewards account for ' + rewardsAccountNumber + ' was found.' );
	}
}

module.exports = {createRewardsAccount, logRewardsAccounts} ;

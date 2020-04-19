function printRewardsAccounts()
{
	var order = JSON.parse( sessionStorage.getItem( 'rewards-meal' ) );

	if( order !== null )
	{
		console.log( JSON.stringify( order ) );

		var numItems = order.length;

		console.log( "NUmber of Items: " + numItems ); 

		var i;
		var next = '';
		var text = '';
		for( i = 0; i < numItems; i++ )
		{

			text +=  '<div class="row">' +
							'<p></p>' +
							'<h1 class="rewards-header" style="font-size: 5vw;">Welcome ' + sessionStorage.getItem('rewards-name-save') + ' (' + sessionStorage.getItem('rewards-number-save') + ')</h1>' +
						'</div>';
			next +=
						'<div class="row">' +
							'<p class="col-1"></p>' +
							'<h1 class="col-5 rewards-header" style="font-size: 4vw; color: mediumslateblue">Would you like another:<br><span style="color: red; -webkit-text-stroke: 0.2vh red;">' + order[ i ][ "name" ] + '</span></br>' +
							'</h1>' +    
							'<div onclick="addItemToOrder()" class="col-3 menu-box menu-box-image" style="cursor: pointer; background-image: url('+order[ i ][ "image" ]+');">' +
							'</a>' +
							'<p class="col-3"></p>' +
						'</div>';
		}
	}

	document.getElementById("welcome-rewards-header").innerHTML += sessionStorage.getItem('rewards-name-save');
	document.getElementById("number-rewards-header").innerHTML += sessionStorage.getItem('rewards-number-save');
	if(sessionStorage.getItem('rewards-meal')!=null)
		document.getElementById("if-else-display").innerHTML += next;
}

function addItemToOrder()
{
	var table = sessionStorage.getItem('tableid');
	var rewardsItem = JSON.parse( sessionStorage.getItem( 'rewards-meal' ) )[ 0 ];
	rewardsItem.sent = 'false';

	var cur_ord = {};
	cur_ord.table = table;
	// cur_ord.rewards = ;
	cur_ord.status = "in progress";
	cur_ord.items = [];
	cur_ord.items[ 0 ] = rewardsItem;

	sessionStorage.setItem('current_order', JSON.stringify(cur_ord));

	window.location.href = "View-Order.html";
}

module.exports = {  printRewardsAccounts };

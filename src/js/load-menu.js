function loadMenu()
{
	$(document).ready(function() {
		var cats = sessionStorage.getItem('type');
		var pageTitle = cats;
		pageTitle = pageTitle[0].toUpperCase() + pageTitle.substr(1) + 's';
		document.getElementById('category').innerText = pageTitle;

		var maxloc=-1;
		maxloc = JSON.parse( sessionStorage.getItem('max') );
		//console.log(maxloc);
		if (maxloc != undefined) {
			maxloc = maxloc[cats][0];
		}

		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function() {
			if( this.readyState == 4 && this.status == 200 )
			{
				//var doc = document.getElementById( 'textarea-menu-view' );

				// Response is a JSON array of items
				var obj = JSON.parse( this.responseText );

				var numItems = Object.keys( obj ).length;

				//doc.innerHTML = "Number of Menu Items: " + numItems + "\n";

				var i;
				var j = 1;
				var itemBox;
				if (maxloc >= 0) {
					var currItem = obj[maxloc];
					itemBox = document.getElementById("foodText".concat(1));
					itemBox.innerText = currItem.name;
					var item = document.getElementById("food".concat(1));
					item.style.backgroundImage = "url(".concat(currItem.image, ")");
					item.style.visibility = "visible";
					item.name = JSON.stringify(currItem);
					for( i = 0; i < numItems; i++ )
					{
						currItem = obj[ i ];
						if (currItem.category === cats && maxloc != i) {
							j++;
							if (j > 8) {
								document.getElementById('row3').style.height = "35vh";
							}
							itemBox = document.getElementById("foodText".concat(j));
							itemBox.innerText = currItem.name;
							var item = document.getElementById("food".concat(j));
							item.style.backgroundImage = "url(".concat(currItem.image, ")");
							item.style.visibility = "visible";
							item.name = JSON.stringify(currItem);
						}
					}
				}
			}
			else if( this.readyState == 4 && this.status != 200 )
			{
				//console.log( "Request inventory status response: " + this.status );
			}
		};

		// Send a GET request to 64.225.29.130/inventory/view
		xmlHttp.open( "GET", "http://64.225.29.130/menu/view-available", true );
		xmlHttp.send();
	});
}

function getCookieByName(name) {

	var cook = document.cookie.split(';');
	var temp;
	for (var i=0; i< cook.length; i++) {
		temp = cook[i].split('=');
		if (temp[0] == name) {
			newLocal = temp[1];
			return newLocal;
		}
	}
}

function load_item() {
	suppressEnter();
	$(document).ready(function() {
		var obj=Cookies.getJSON('current_item');
		document.getElementById("item-name").innerText = obj.name;
		document.getElementById("descrip").innerText = obj.description;
		document.getElementById("food_pic").style.backgroundImage = "url(".concat(obj.image,")");
		var ingArr = obj.ingredients;
		var hasIng = obj.hasIngredient;
		var ingCount = obj.ingredientCount;
		var inventory  = JSON.parse(window.localStorage.getItem('inventory'));
		for (i=0; i < ingArr.length; i++) {
			console.log( inventory[ingArr[i]]);
			console.log( inventory[ingArr[i]]);
			console.log( ingCount[i]);
			if ( inventory[ingArr[i]] == undefined || inventory[ingArr[i]] < ingCount[i] ) {
				currLab = document.getElementById("top".concat(i+1));
				currLab.innerText = ingArr[i] + ' (out of stock)';
				currLab.style.visibility = "visible";
				currLab.style.color = 'red';
				currBox = document.getElementById("topping_".concat(i+1));
				currLab.checked = false;
			}
			else {
				currLab = document.getElementById("top".concat(i+1));
				currLab.innerText = ingArr[i];
				currLab.style.visibility = "visible";
				currLab.style.color = 'black';
				currBox = document.getElementById("topping_".concat(i+1));
				currBox.style.visibility = "visible";
				if (hasIng[i] == 1) {
					currBox.checked = true;
				}
			}
		}
		var allergens = document.getElementById('allerg');
		for (i=0; i < obj.allergens.length; i++) {
			if (i > 0) {
				allergens.innerText = allergens.innerText.concat(', ', obj.allergens[i]);
			}
			else {
				allergens.innerText = "Allergens: ".concat(obj.allergens[i]);
			}
		}
		document.getElementById('Kcal').innerText  = "Calories: ".concat(obj.calories);
	});
}

function load_ingredients() {
		var obj=Cookies.getJSON('current_item');
		var ingArr = obj.ingredients;
		var hasIng = obj.hasIngredient;
		var str = obj.name.concat(" $", obj.price, '\n', "Ingredients: ");

		for (i=0; i < ingArr.length; i++) {
			obj.hasIngredient[i] = 0;
			currLab = document.getElementById("top".concat(i+1));
			//currLab.innerText = ingArr[i];
			currBox = document.getElementById("topping_".concat(i+1));
			//currBox.style.visibility = "visible";
			if (currBox.checked == true) {
				str = str.concat(currLab.innerText, ', ');
				obj.hasIngredient[i] = 1;
			}
		}
		str = str.slice(0, -2);
		document.getElementById("confirm-choice").innerText = str;
		return(obj);
}

function loadOrderItems() {
	// supressing enter key
	suppressEnter();
	$(document).ready(function() {
		var order;
		
		// Get table ID
		var table = sessionStorage.getItem('tableid');

		// Check if table ID is not set or invalid
		if ( table === null || table === "" || isNaN( parseInt( table ) ) || parseInt( table ) < 1 || parseInt( table ) > 20 ) 
		{
			console.log( "Bad table ID: " + table );

			location = "login.html";
		}

		// replace with real rewards num
		// default is 0
		var rewards = '';

		if (sessionStorage.getItem('current_order') == null) {
			var cur_ord = {
				"table":table,
				"rewards":rewards,
				"status":"in progress"};
			console.log(cur_ord);
			sessionStorage.setItem('current_order', JSON.stringify(cur_ord));
			order = JSON.parse( sessionStorage.getItem('current_order') );
			console.log(order);
		}
		else {
			order = JSON.parse( sessionStorage.getItem('current_order') );
		}

		order.table = table;

		if (document.getElementById('pageTitle').innerText == "View Order") {
			// adding new item
			if (Cookies.get('new_item') == 1) {
				order.status = "in progress";
				var newItem = Cookies.getJSON('current_item');
				if (order.items == undefined) {
					order['items'] = [newItem];
				}
				else {
					order.items.push(newItem);
				}
				Cookies.set('new_item', 0, {path: '/', sameSite: 'strict'});
			}

			// handling empty order
			if (order.items == undefined || order.items.length == 0) {
				document.getElementById('itemList').innerText = 'Tap "Add item" to order food';
				order.status = "none";
				//Cookies.set('current_order', order, {path: '/', sameSite: 'strict'});
				sessionStorage.setItem('current_order', JSON.stringify(order));
				document.getElementById("sendOrderBtn").style.display = 'none';
				return;
			}
			else {
				document.getElementById("sendOrderBtn").style.display = 'unset';
			}
		}

		// adding free drink discounts
		var freeDrinks = 0;
		for (var i=0; i < order.items.length; i++) {
			if (order.items[i].category == 'entree') {
				freeDrinks = freeDrinks + 1;
			}
		}

		var output = "";
		var total = 0;
		for (i=0; i < order.items.length; i++) {
			if (document.getElementById('pageTitle').innerText == "View Order" || order.items[i].sent == 'true') {
				// adding happy hour discount
				var date = new Date();
				if (order.items[i].category == 'dessert' && order.items[i]['happy_hour'] == undefined && date.getHours() >= 17 && date.getHours() <= 19) {
					order.items[i]['happy_hour'] = true;
					order.items[i].price = Number((order.items[i].price / 2).toFixed(2));
				}

				// printing name, price, discount
				output = output.concat(i+1, ". ");
				if (order.items[i].sent != 'false') {
					if (document.getElementById('pageTitle').innerText == "View Order") {
						output = output.concat('(sent) ');
					}
				}

				if (order.items[i].category == 'drink' && freeDrinks > 0) {
					freeDrinks = freeDrinks - 1;
					order.items[i]['free_drink'] = 'true';
					output = output.concat(order.items[i].name, " $", 0);
					output = output.concat(' (free drink with entree)');
				}
				else {
					order.items[i]['free_drink'] = 'false';
					total += order.items[i].price;
					output = output.concat(order.items[i].name, " $", order.items[i].price);
					if (order.items[i].happy_hour != undefined) {
						output = output.concat(' (happy hour discount!)');
					}
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
		if (document.getElementById('pageTitle').innerText == "View Order") {
			if (order.status == "in progress") {
				if (order.items[0].sent == 'true') {
					document.getElementById("sendOrderText").innerText = 'Send new items';
				}
				else {
					document.getElementById("sendOrderText").innerText = 'Send order';
				}
			}
			else {
				document.getElementById("sendOrderText").innerText = 'Go to bill';
			}
		}

		//Cookies.set('current_order', order, {path: '/', sameSite: 'strict'});
		console.log('current order: ',  order);
		sessionStorage.setItem('current_order', JSON.stringify(order));
		total = Number((total));
		var tax = Number((total * 0.0825));
		output = output.concat('Subtotal: $', addTrailingZeros(total),'\n');
		output = output.concat('Tax:      $', addTrailingZeros(tax),'\n');
		output = output.concat('___________________________________________\n');
		output = output.concat('Total:    $', addTrailingZeros(total + tax),'\n');
		document.getElementById('itemList').innerText = output;
	});
}

function addTrailingZeros(num) {
	var str = (Number(num.toFixed(2))).toString();
	var length = str.length;
	var dot = str.length;
	for (i=0; i < length; i++) {
		if (str[i] == '.') {
			dot = i;
		}
	}
	if (dot == length) {
		str = str.concat('.00');
		dot = length - 3;
	}
	while (length - dot < 3) {
		str = str.concat('0');
		dot--;
	}
	return str;
}

function addToOrder(obj) {
	obj.sent = 'false';
	Cookies.set("current_item", JSON.stringify(obj), { path: '/', sameSite: 'strict' });
	Cookies.set("new_item", '1', {path: '/', sameSite: 'strict'});
	window.location.href='View-Order.html';
}

function saveChoice(num) {
	var obj = document.getElementById("food".concat(num));
	var str = "current_item="
	str = str.concat(obj.name);
	//document.cookie = str.concat(";");
	Cookies.set("current_item", obj.name, {path: '/', sameSite: 'strict'});
}

function setType(type) {
	console.log( "Set " );
	sessionStorage.setItem('type', type );
}

function editRemoveItem(edRom) {
	if (edRom == 1) {
		var item = document.getElementById('edit-choice');
	}
	else {
		var item = document.getElementById('remove-choice');
	}
	var selection = item.value - 1;
	if (selection >= 0 && selection < (Cookies.getJSON('current_order')).items.length) {
		Cookies.set('current_item', (Cookies.getJSON('current_order')).items[selection], {path: '/', sameSite: 'strict'});
		var temp = Cookies.getJSON('current_order');
		if (temp.items[selection].sent == 'true') {
			if (edRom == 1) {
				var err = document.getElementById('cokies');
			}
			else {
				var err = document.getElementById('coookies');
			}
			err.innerText = "\nCannot delete or edit sent items";
			err.style.color = "red";
			err.style.display = "unset";
			//console.log("sent");
		}
		else {
			temp.items.splice(selection, 1);
			if (temp.items.length > 0) {
				if (temp.items[temp.items.length - 1].sent == 'true') {
					temp.status = 'ordered';
				}
			}
			Cookies.set('current_order', temp, {path: '/', sameSite: 'strict'});
			if (edRom == 1) {
				window.location.href='Menu-Item.html';
			}
			//console.log("unsent");
		}
	}
	else {
		if (edRom == 1) {
			var err = document.getElementById('cokies');
		}
		else {
			var err = document.getElementById('coookies');
		}
		err.innerText = "\nItem with this number does not exist";
		err.style.color = "red";
		err.style.display = "unset";
	}
	if (edRom == 0) {
		loadOrderItems();
	}
}

function suppressEnter() {
	$('form input').keydown(function (enter) {
		if (enter.keyCode == 13) {
		  enter.preventDefault();
		  return false;
		}
	});
}

module.exports = {loadMenu, getCookieByName, load_item, load_ingredients, loadOrderItems, addTrailingZeros, addToOrder, saveChoice, setType, editRemoveItem, suppressEnter} ;
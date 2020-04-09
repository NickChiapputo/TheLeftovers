function loadMenu(cats)
{
    $(document).ready(function() {
        var pageTitle = cats;
        pageTitle = pageTitle.charAt(0).toUpperCase() + pageTitle.substr(1) + 's';
        document.getElementById('category').innerText = pageTitle;

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
                var j;
                j = 0;
                var itemBox;
                for( i = 0; i < numItems; i++ )
                {
                    var currItem = obj[ i ];
                    //doc.innerHTML += "\nItem " + ( i + 1 ) + "\n";
                    if (currItem.category === cats) {
                        j++;
                        if (j > 8) {
                            document.getElementById('row3').style.height = "35vh";
                        }
                        itemBox = document.getElementById("foodText".concat(j));
                        //doc.innerHTML += "    food:    " + currItem.name;
                        //doc.innerHTML += "\n    type:" + currItem.category;
                        //doc.innerHTML += "\n  box id:" + "food".concat(j);

                        itemBox.innerText = currItem.name;
                        var item = document.getElementById("food".concat(j));
                        item.style.backgroundImage = "url(".concat(currItem.image, ")");
                        item.style.visibility = "visible";
                        item.name = JSON.stringify(currItem);
                    }
                    
                }
            }
            else if( this.readyState == 4 && this.status != 200 )
            {
                console.log( "Request inventory status response: " + this.status );
            }
	    };

        // Send a GET request to 64.225.29.130/inventory/view
        xmlHttp.open( "GET", "http://64.225.29.130/menu/view", true );
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
        for (i=0; i < ingArr.length; i++) {
            currLab = document.getElementById("top".concat(i+1));
            currLab.innerText = ingArr[i];
            currLab.style.visibility = "visible";
            currBox = document.getElementById("topping_".concat(i+1));
            currBox.style.visibility = "visible";
            if (hasIng[i] == 1) {
                currBox.checked = true;
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
            currLab.innerText = ingArr[i];
            currBox = document.getElementById("topping_".concat(i+1));
            currBox.style.visibility = "visible";
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
        // replace with real values later
        var id=Math.random().toString(36);
        var table = Cookies.get('table-num');
        if (table == undefined) {
            table = 0;
        }
        document.getElementById('tableNum').innerText = table;
        // replace with real rewards num
        var rewards = 'rewardsNum';

        if (Cookies.get('current_order') == undefined) {
            Cookies.set('current_order', {"_id":id,
            "table":table,
            "rewards":rewards,
            "status":"in progress"}, {path: '/', sameSite: 'strict'});
            order = Cookies.getJSON('current_order');
        }
        else {
            order = Cookies.getJSON('current_order')
        }
        if (Cookies.get('new_item') == 1) {
            var newItem = Cookies.getJSON('current_item');
            if (order.items == undefined) {
                order['items'] = [newItem];
            }
            else {
                order.items.push(newItem);
            }
            Cookies.set('new_item', 0, {path: '/', sameSite: 'strict'});
        }
        Cookies.set('current_order', order, {path: '/', sameSite: 'strict'});

        var output = "";
        for (i=0; i < order.items.length; i++) {
            output = output.concat(i+1, ". ", order.items[i].name, '\n')
            for (j=0; j < order.items[i].ingredients.length; j++) {
                if (order.items[i].hasIngredient[j] == '1') {
                    output = output.concat('----', order.items[i].ingredients[j], '\n');
                }
            }
            output = output.concat('\n');
        }
        document.getElementById('itemList').innerText = output;
    });
}

function addToOrder(obj) {
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
    Cookies.set("type", type, {path: '/', sameSite: 'strict'});
    //document.cookie = "type=".concat(type,";path=/Customer%20App/menu;");
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
        temp.items.splice(selection, 1);
        Cookies.set('current_order', temp, {path: '/', sameSite: 'strict'});
        if (edRom == 1) {
            window.location.href='Menu-Item.html';
        }
    }
    else {
        if (edRom == 1) {
            var err = document.getElementById('cokies');
        }
        else {
            var err = document.getElementById('coookies');
        }
        err.innerText = "\nError: item with this number does not exist";
        err.style.color = "red";
        err.style.display = "unset";
    }
}

function sendOrder() {

}

function suppressEnter() {
    $('form input').keydown(function (enter) {
        if (enter.keyCode == 13) {
          enter.preventDefault();
          return false;
        }
    });
}
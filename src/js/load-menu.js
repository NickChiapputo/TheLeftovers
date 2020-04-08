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
    $(document).ready(function() {
        var obj=Cookies.getJSON('current_item');

        document.getElementById("confirm-choice").innerText = obj.name.concat(" $", obj.price);

        document.getElementById("item-name").innerText = obj.name;
        document.getElementById("descrip").innerText = obj.description;
        document.getElementById("food_pic").style.backgroundImage = "url(".concat(obj.image,")");
        var ingArr = obj.ingredients;
        //document.getElementById("top1").innerText = ingArr[0];
        //var currIng;
        for (i=0; i < ingArr.length; i++) {
            //currIng = document.getElementById("topping_".concat(i+1));
            currLab = document.getElementById("top".concat(i+1));
            currLab.innerText = ingArr[i];
            currLab.style.visibility = "visible";
            currBox = document.getElementById("topping_".concat(i+1));
            currBox.style.visibility = "visible";
            //currIng.name = ingArr[i];
            //currIng.value = ingArr[i];
        }
    });
}

//current_item={"_id":"5e8cc064bf8f1f486fef28d4",
//  "name":"BBQ Burger",
//  "price":3,
//  "calories":255,
//  "ingredients":["Patty","Bun","Onion","Cheese"],
//  "hasIngredient":[1,1,1,0],
//  "ingredientCount":[1,1,1,1],
//  "allergens":["meat","dairy","gluten"],
//  "description":"its a BBQ burger",
//  "category":"entree",
//  "image":"http://64.225.29.130/img/bbq-bacon-cheeseburger-recipe-kc-masterpiece-1.jpg"}

function saveChoice(num) {
    var obj = document.getElementById("food".concat(num));
    var str = "current_item="
    str = str.concat(obj.name);
    //document.cookie = str.concat(";");
    Cookies.set("current_item", obj.name, { path: '/' });
}

function setType(type) {
    Cookies.set("type", type, {path: '/'});
    //document.cookie = "type=".concat(type,";path=/Customer%20App/menu;");
}
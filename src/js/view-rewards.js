
function printRewardsAccounts()
{
	alert(sessionStorage.getItem('rewards-name-save'));

    var text =  '<div class="row">' +
                    '<p></p>' +
                    '<h1 class="rewards-header" style="-webkit-text-stroke: 0.2vh black; font-size: 5vw;">Welcome ' + sessionStorage.getItem('rewards-name-save') + ' [#' + sessionStorage.getItem('rewards-number-save') + ']</h1>' +
                '</div>' +
                '<div class="row">' +
                    '<p class="col-1"></p>' +
                    '<h1 class="col-5 rewards-header" style="-webkit-text-stroke: 0.2vh black; font-size: 4vw; color: limegreen">Would you like another ' + sessionStorage.getItem('rewards-meal-save') + '?' +
                    '</h1>' +    
                    '<a href="../menu/menu.html" class="col-3 menu-box menu-box-image" style="background-image: url('+sessionStorage.getItem("rewards-meal-image-save")+');">' +
                    '</a>' +
                    '<p class="col-3"></p>' +
                '</div>';               

    if (sessionStorage.getItem('rewards-meal-save') == "Not Available"){}    
    else document.getElementById("if-else-display").innerHTML += text;
}
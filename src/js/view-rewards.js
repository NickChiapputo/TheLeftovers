
function printRewardsAccounts()
{
    document.getElementById("welcome-rewards-header").innerHTML += sessionStorage.getItem('rewards-name-save');
    document.getElementById("number-rewards-header").innerHTML += sessionStorage.getItem('rewards-number-save');

    var text =  '<div class="row menu-row">' +
                    '<div class="col menu-row">' +
                        '<h1 style="color: white; -webkit-text-stroke: 0.2vh black; font-size: 4vw;">Would you like another ' + sessionStorage.getItem('rewards-meal-save') + '? </h1>' +
                            '<a href="log.html">' +
                                '<h1 class="col menu-box" style="width: 40%; margin-left: 23vw; margin-right: 0vw; background-color:limegreen;">Yes</h1>' +
                            '</a>' +
                    '</div>' +
                    '<div id="last-meal-header" class="col-3 menu-row">' +
                        '<a href="Menu-Item.html" class="col item-large-image" style="background-image: url('+sessionStorage.getItem("rewards-meal-image-save")+'); ">' +
                            '<h1 class="menu-text">' + sessionStorage.getItem('rewards-meal-save') + '</h1>' +
                        '</a>' +
                    '</div>' +
                '</div>';

    document.getElementById("if-else-display").innerHTML += text;
}

module.exports = {  printRewardsAccounts };
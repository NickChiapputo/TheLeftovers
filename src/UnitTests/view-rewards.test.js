const { printRewardsAccounts } = require('../js/view-rewards');

test('Storage is null', () => {
    document.body.innerHTML+='<div id="welcome-rewards-header"></div>';
    document.body.innerHTML+='<div id="number-rewards-header"></div>';
    document.body.innerHTML+='<div id="if-else-display"></div>';
    document.body.innerHTML+='<div id="welcome-header-display"></div>'
    const text =  printRewardsAccounts();
    console.log("Storage is "+sessionStorage.getItem('rewards-name-save'))
    expect(sessionStorage.getItem('rewards-name-save')).toBe(null)
})

test('Welcome message should print', () =>{
    sessionStorage.setItem('rewards-name-save',"Khaemon Edwards");
    document.body.innerHTML+='<h1 class="rewards-header" style="-webkit-text-stroke: 0.2vh black; font-size: 5vw;">Welcome ' + ' (' + ')</h1>'
    document.body.innerHTML+='<div id="number-rewards-header"></div>';
    document.body.innerHTML+='<div id="if-else-display"></div>';
    document.body.innerHTML+='<div id="welcome-header-display"></div>'
    const text =  printRewardsAccounts();
    console.log("Storage is "+sessionStorage.getItem('rewards-name-save'))
    expect(document.getElementById('welcome-header-display').innerHTML).toBe("<div class=\"row\"><p></p><h1 class=\"rewards-header\" style=\"-webkit-text-stroke: 0.2vh black; font-size: 5vw;\">Welcome null (null)</h1></div><div class=\"row\"><p></p><h1 class=\"rewards-header\" style=\"-webkit-text-stroke: 0.2vh black; font-size: 5vw;\">Welcome Khaemon Edwards (null)</h1></div>");
});
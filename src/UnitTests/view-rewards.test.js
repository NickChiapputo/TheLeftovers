const { printRewardsAccounts } = require('../js/view-rewards');

test('Storage is null', () => {
    document.body.innerHTML+='<div id="welcome-rewards-header"></div>';
    document.body.innerHTML+='<div id="number-rewards-header"></div>';
    document.body.innerHTML+='<div id="if-else-display"></div>';
    const text =  printRewardsAccounts();
    console.log("Storage is "+sessionStorage.getItem('rewards-name-save'))
    expect(sessionStorage.getItem('rewards-name-save')).toBe(null)
})
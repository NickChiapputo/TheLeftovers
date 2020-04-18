const { printRewardsAccounts } = require('../js/view-rewards');

test('Storage is null', () => {
    document.body.innerHTML+='<div id="welcome-rewards-header"></div>';
    document.body.innerHTML+='<div id="number-rewards-header"></div>';
    document.body.innerHTML+='<div id="if-else-display"></div>';
    document.body.innerHTML+='<div id="welcome-header-display"></div>';
    jest.spyOn(window,'alert').mockImplementation(() => {});
    const text =  printRewardsAccounts();
    console.log("Storage is "+sessionStorage.getItem('rewards-name-save'))
    expect(sessionStorage.getItem('rewards-name-save')).toBe(null)
})

test('Name and number should store properly', () =>{
    sessionStorage.setItem('rewards-name-save',"Khaemon Edwards");
    sessionStorage.setItem('rewards-number-save',"8888880000")
    jest.spyOn(window,'alert').mockImplementation(() => {});
    document.body.innerHTML+='<h1 id="welcome-rewards-header" style="padding-left: 1vw; padding-right: 1vw; text-align: center; max-width: 90vw; min-width: 90vw; color: black; -webkit-text-stroke: 0.2vh white; font-size: 8vw;">Welcome </h1>'
    document.body.innerHTML+='<div id="number-rewards-header"></div>';
    document.body.innerHTML+='<div id="if-else-display"></div>';
    const text =  printRewardsAccounts();
    console.log(text);
    console.log("Storage is "+sessionStorage.getItem('rewards-name-save')+" "+sessionStorage.getItem('rewards-number-save'))
    expect(document.getElementById('welcome-rewards-header').innerHTML+" "+sessionStorage.getItem('rewards-number-save')).toBe("nullKhaemon Edwards 8888880000");
});

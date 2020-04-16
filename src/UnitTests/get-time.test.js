const week = require('../js/get-time');

test('Should output the date from Sunday until Saturday', () => {
	document.body.innerHTML = '<p style="font-size: 2vw; font-weight: bold; text-align: right; margin: auto;" id="date"></p>';

    let date = new Date();
    let currentweek = (date.getMonth()+1)+'/'+(date.getDate()-date.getDay())+'/'+date.getFullYear();
    let nextweek = (date.getMonth()+1)+'/'+(date.getDate()+(6-date.getDay()))+'/'+date.getFullYear();
    let duration = currentweek+'-'+nextweek;
    const text = week();

    console.log( "Date Inner HTML: " + document.getElementById("date").innerHTML );
    console.log( duration );

    expect(document.getElementById("date").innerHTML).toBe(duration);
})
const {week,addZero,clock} = require('../js/get-time');

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
});



test('If a number is less than 10 a zero should be concatonated to the front', () =>{
    console.log("9 is now converted into "+addZero(9));
    console.log("The number should be 09");
    expect(addZero(9)).toBe("09");

});


test('The clock should output the current time', () => {
    document.body.innerHTML = ' <p style="font-size: 2vw; font-weight: bold; text-align: right; margin: auto;" id="time"></p>'

    var date = new Date();
    var am_pm = "pm"
    var currentTime = date.getHours();
    if (currentTime < 12) {
      am_pm = "am"
      if (currentTime == 0) {
        currentTime = 12
      }
    }
    else {
      if(currentTime!=12)
        currentTime = currentTime - 12;
    }
    currentTime += ":";
    currentTime += addZero(date.getMinutes())
    currentTime += am_pm;
    var x = setTimeout(clock, 5000);
  
    function addZero(num) {
    if (num < 10) {
      num = "0" + num;
    }
    return num;
}
    const text = clock();
    console.log(currentTime + " is being compared to " + document.getElementById('time').innerHTML );
    expect(document.getElementById('time').innerHTML).toBe(currentTime);
});
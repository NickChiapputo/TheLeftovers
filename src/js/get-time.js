/* credit w3schools for clock and addZero */
function clock() {
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
    document.getElementById("time").innerHTML = currentTime;
    var x = setTimeout(clock, 5000);
  }
  function addZero(num) {
    if (num < 10) {
      num = "0" + num;
    }
    return num;
}
function week(){
  let date = new Date();
  let currentweek = (date.getMonth()+1)+'/'+(date.getDate()-date.getDay())+'/'+date.getFullYear();
  let nextweek = (date.getMonth()+1)+'/'+(date.getDate()+(6-date.getDay()))+'/'+date.getFullYear();
  let duration = currentweek+'-'+nextweek;
  document.getElementById("date").innerHTML=duration;
}
function saveCookie(id, min) {
  var date = new Date();
  if (date.getMinutes() < 60 - min) {
    date.setMinutes(date.getMinutes() + min);
  }
  else {
    date.setHours(date.getHours() + 1);
    date.setMinutes((date.getMinutes() + min) % 60);
  }
  str = document.getElementById(id).value;
  str = str.concat(";path=/Customer%20App; expires=", date.toUTCString());
  document.cookie = str;
  loadCookie();
}

function loadCookie(id) {
  document.getElementById(id).innerText = document.cookie;
}

function clearCookies() {
  var str = document.cookie.split(';');
  var date = new Date();
  for (i=0; i < document.cookie.length; i++) {
    document.cookie = ''.concat((str.split('='))[0],"=; expires=",date.toUTCString());
  }
}

module.exports = {saveCookie, loadCookie, clearCookies} ;
function displayTime()
{
    let d = new Date();
    document.getElementById('currenttime').placeholder=d.toLocaleTimeString();
    setInterval(displayTime, 1000);
}

document.call(displayTime());

function editm()
{
    window.location ="http://127.0.0.1:5500/managers/editmenu.html";
}

function mfrontScreen()
{
    window.location ="http://127.0.0.1:5500/managers/manager1.html"
}

function schedule()
{
    window.loaction ="http://127.0.0.1:5500/managers/schedule.html"
}

function stats()
{
    window.location ="http://127.0.0.1:5500/managers/stats.html"
}

function inventory()
{
    window.location ="http://64.225.29.130/"
}

function staff()
{
    window.location="http://127.0.0.1:5500/managers/staff.html"
}

function coupons()
{
    window.location="http://127.0.0.1:5500/managers/coupons.html"
}

function entrees()
{
    window.location="http://127.0.0.1:5500/managers/entrees.html"
}

function sides()
{
    window.location="http://127.0.0.1:5500/managers/sides.html"
}

function drinks()
{
    window.location="http://127.0.0.1:5500/managers/drinks.html"
}

function desserts()
{
    window.location="http://127.0.0.1:5500/managers/desserts.html"
}
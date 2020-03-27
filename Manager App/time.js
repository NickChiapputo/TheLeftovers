function displayTime()
{
    let d = new Date();
    document.getElementById('currenttime').placeholder=d.toLocaleTimeString();
    setInterval(displayTime, 1000);
}

document.call(displayTime());

function editm()
{
    window.location ="http://127.0.0.1:5500/Manager/editmenu.html";
}

function mfrontScreen()
{
    window.location ="http://127.0.0.1:5500/Manager/manager1.html"
}

function schedule()
{
    window.loaction ="http://127.0.0.1:5500/Manager/schedule.html"
}

function stats()
{
    window.location ="http://127.0.0.1:5500/Manager/stats.html"
}

function inventory()
{
    window.location ="http://127.0.0.1:5500/Manager/inventory.html"
}

function staff()
{
    window.location="http://127.0.0.1:5500/Manager/staff.html"
}

function coupons()
{
    window.location="http://127.0.0.1:5500/Manager/coupons.html"
}

function entrees()
{
    window.location="http://127.0.0.1:5500/Manager/entrees.html"
}

function sides()
{
    window.location="http://127.0.0.1:5500/Manager/sides.html"
}

function drinks()
{
    window.location="http://127.0.0.1:5500/Manager/drinks.html"
}

function desserts()
{
    window.location="http://127.0.0.1:5500/Manager/desserts.html"
}
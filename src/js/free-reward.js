function getFreeReward(){
    var userNum = document.getElementById("user-input-number").value;

    if (userNum < 1 || userNum > 6) alert("Number not in range! Try again 😜")
    else if (userNum == randomNumber(1,6))
    {
        alert("You won a free desert! 😀");
        window.location="View-Order.html";
    }
    else
    { 
        alert("Sorry! better luck next time ☹️");
        window.location="menu.html";
    }
}

function randomNumber(min, max) { 
	return Math.floor(Math.random() * (max - min) + min); 
} 

module.exports = {randomNumber}
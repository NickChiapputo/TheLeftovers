function submitFeedback() {
    var input1 = document.getElementById('user-input-1').value;
    if (input1 == '') {input1 = 'N/A'}
    var input2 = document.getElementById('user-input-2').value;
    if (input2 == '') {input2 = 'N/A'}
    var input3 = document.getElementById('user-input-3').value;
    if (input3 == '') {input3 = 'N/A'}

    if (input1 == 'N/A' && input2 == 'N/A' && input3 == 'N/A') {}
    else {
        console.log ('one: ', input1, '\ntwo: ', input2, '\nthree', input3);
        // send survey
    }

    window.location="free-item-game.html";

}
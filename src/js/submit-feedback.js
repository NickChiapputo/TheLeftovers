function submitFeedback() {
    var input1List = document.getElementsByName('user-input-1');
    var input1 = '';

    var i;
    for( i = 0; i < input1List.length; i++ )
    {
        if( input1List[ i ].checked )
        {
            input1 = input1List[ i ].value;
            break;
        }
    }

    if (input1 == '') {input1 = 'N/A'}

    var input2 = document.getElementById('user-input-2').value;
    if (input2 == '') {input2 = 'N/A'}

    var input3 = document.getElementById('user-input-3').value;
    if (input3 == '') {input3 = 'N/A'}

    if (input1 !== 'N/A' || input2 !== 'N/A' || input3 !== 'N/A')
    {
        var feedback = {};
        feedback[ document.getElementById( "question-1" ).innerHTML ] = input1;
        feedback[ document.getElementById( "question-2" ).innerHTML ] = input2;
        feedback[ document.getElementById( "question-3" ).innerHTML ] = input3;

        var query = JSON.stringify( feedback );
        var method = "POST";
        var url = "http://64.225.29.130/feedback/submit"
        var asynchronous = false;

        var response = communicateWithServer( query, method, url, asynchronous );
    }

    // window.location="free-item-game.html";

}

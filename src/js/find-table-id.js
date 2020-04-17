function findID()
{
    var enteredTableNumber = parseInt( document.getElementById( "new-num" ).value );

    if( enteredTableNumber < 1 || enteredTableNumber > 20 || isNaN( enteredTableNumber ) )
    {
        alert( "Table number must be between 1 and 20." );
        return false;
    }
    else
    {
        console.log( "Entered Table Number: " + enteredTableNumber );
    }

    var params = {};
    params['table'] = parseInt( document.getElementById( "new-num" ).value );

    console.log( "Sending: " + JSON.stringify( params ) );

    // Get a synchronous response so that the user is forced to enter a valid table number
    var response = sendData( JSON.stringify( params ) );

    // Check the server response
    if( response.status === 200 )
    {
        // Handle good response (valid table number)
        return true;
    }
    else
    {
        // Handle a bad reponse
        return false;
    }

    // var xmlHttp = new XMLHttpRequest();
    // xmlHttp.onreadystatechange = function() {
    //     if( this.readyState == 4 && this.status == 200 )
    //     {
    //         console.log( "Good table ID input: " + this.responseText );

    //         var obj = JSON.parse( this.responseText );

    //         sessionStorage.setItem("tableid-messenger",obj['server']);
    //         sessionStorage.setItem('tableid',document.getElementById('new-num').value)
    //         Cookies.remove('current_order');
    //         Cookies.set('table-num', document.getElementById('new-num').value, {path: '/', sameSite: 'strict'});
    //     }
    //     else if( this.readyState == 4 && this.status != 200 )
    //     {

    //         console.log( "Find ID status response: " + this.status + "\n" + this.responseText + "\n" );

    //         // Invalid ID, make the user enter it again
    //        initializeTable();
    //     }
    // };

    // Send a GET request to 64.225.29.130/inventory/view
    // xmlHttp.open( "POST", "http://64.225.29.130/tables/search", false );
    // xmlHttp.send(JSON.stringify(params));
}

function sendData( data )
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "POST", "http://64.225.29.130/tables/search", false );
    xmlHttp.send( data );
    return xmlHttp;
}

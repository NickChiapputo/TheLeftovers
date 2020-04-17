function sendHelp(note)
{	
    var params = {}
    params['src']=sessionStorage.getItem('tableid');
    params['srcType']='table';
    params['dest']=sessionStorage.getItem('tableid-messenger');
    params['destType']='server';
    if(note=="help")//I labeled buttons wrong thats why it's opposite
    {
        params['request']='refill';
    }
    else if(note=="refill")
    {
        params['request']='help';
    }
    else
    {
        params['request']=note;
    }
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if( this.readyState == 4 && this.status == 200 ) 
        {
            console.log( this.responseText );
        
            // Response is a JSON array of items
            var obj = JSON.parse( this.responseText );
            var numItems = Object.keys( obj ).length;

            alert("Server "+params['dest']+" was notified");
            console.log( this.responseText );
        }
        else if( this.readyState == 4 && this.status != 200 )
        {
            console.log( "Rewards accounts inventory status response: " + this.status );
        }
    };

    // Send a GET request to 64.225.29.130/inventory/view
    xmlHttp.open( "POST", "http://64.225.29.130/messages/send", true );
    xmlHttp.send(JSON.stringify(params));
    return params['request'];
} 
module.exports = {sendHelp};

function initializeTable() {
    // Get table ID
	var tab = sessionStorage.getItem('tableid');

    // Check if table ID is not set or invalid
	if ( tab === null || tab === "" || isNaN( parseInt( tab ) ) || parseInt( tab ) < 1 || parseInt( tab ) > 20 ) 
    {
        console.log( "Bad table ID: " + tab );

        location = "login.html";
	}
    else
    {
        document.getElementById( "table-id" ).innerHTML = "Table " + tab;
        console.log( "Table ID: " + tab );
    }
}

function sendData( data )
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "POST", "http://64.225.29.130/tables/search", false );
    xmlHttp.send( data );
    return xmlHttp;
}

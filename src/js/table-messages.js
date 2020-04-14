function sendHelp()
{	
            var params = {}
        params['src']=sessionStorage.getItem('tableid');
        params['srcType']='table';
        params['dest']=sessionStorage.getItem('tableid-messenger');
        params['destType']='server';
        params['request']='help';

        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if( this.readyState == 4 && this.status == 200 ) 
            {
        //			var doc = document.getElementById( 'order-view-area' );

                console.log( this.responseText );
            
                // Response is a JSON array of items
                var obj = JSON.parse( this.responseText );
                var numItems = Object.keys( obj ).length;

                alert("Server "+params['dest']+" was notified");
                console.log( this.responseText );
            }
            else if( this.readyState == 4 && this.status != 200 )
            {
        //			document.getElementById( 'textarea-orders-view' ).innerHTML = "Rewards accounts inventory status response: " + this.status;
                console.log( "Rewards accounts inventory status response: " + this.status );
            }
        };

        // Send a GET request to 64.225.29.130/inventory/view
        xmlHttp.open( "POST", "http://64.225.29.130/messages/send", true );
        xmlHttp.send(JSON.stringify(params));

}

function sendRefill()
{
    var params = {}
    params['src']=sessionStorage.getItem('tableid');
    params['srcType']='table';
    params['dest']=sessionStorage.getItem('tableid-messenger');
    params['destType']='server';
    params['request']='refill';

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if( this.readyState == 4 && this.status == 200 ) 
        {
    //			var doc = document.getElementById( 'order-view-area' );

            console.log( this.responseText );
        
            // Response is a JSON array of items
            var obj = JSON.parse( this.responseText );
            var numItems = Object.keys( obj ).length;

            alert("Server "+params['dest']+" was notified");
            console.log( this.responseText );
        }
        else if( this.readyState == 4 && this.status != 200 )
        {
    //			document.getElementById( 'textarea-orders-view' ).innerHTML = "Rewards accounts inventory status response: " + this.status;
            console.log( "Rewards accounts inventory status response: " + this.status );
        }
    };

    // Send a GET request to 64.225.29.130/inventory/view
    xmlHttp.open( "POST", "http://64.225.29.130/messages/send", true );
    xmlHttp.send(JSON.stringify(params));
}